#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to fix React Hook dependency warnings
function fixReactHookDependencies(content, filePath) {
  // Fix missing dependencies in useEffect hooks
  const patterns = [
    // Pattern: useEffect(() => { someFunction(); }, []);
    {
      search: /useEffect\(\(\) => \{\s*(\w+)\(\);?\s*\}, \[\]\);/g,
      replace: (match, funcName) => {
        // Add useCallback import if missing
        if (!content.includes('useCallback')) {
          content = content.replace(
            /import\s*{\s*([^}]*)\s*}\s*from\s*['"]react['"]/,
            (match, imports) => {
              if (!imports.includes('useCallback')) {
                return match.replace(imports, imports + ', useCallback');
              }
              return match;
            }
          );
        }
        return `useEffect(() => {
    ${funcName}();
  }, [${funcName}]);`;
      }
    }
  ];

  patterns.forEach(pattern => {
    content = content.replace(pattern.search, pattern.replace);
  });

  return content;
}

// Function to fix specific any types that are safe to replace
function fixSpecificAnyTypes(content) {
  // Fix error handling any types
  content = content.replace(/catch \(error: any\)/g, 'catch (error: unknown)');
  content = content.replace(/catch \(err: any\)/g, 'catch (err: unknown)');
  
  // Fix event handler any types
  content = content.replace(/\(e: any\) =>/g, '(e: unknown) =>');
  content = content.replace(/\(event: any\) =>/g, '(event: unknown) =>');
  
  // Fix data parameter any types
  content = content.replace(/data: any\[\]/g, 'data: unknown[]');
  content = content.replace(/response: any/g, 'response: unknown');
  content = content.replace(/result: any/g, 'result: unknown');
  
  return content;
}

// Function to wrap functions in useCallback for React Hook warnings
function wrapFunctionsInUseCallback(content) {
  // Pattern to find functions that should be wrapped in useCallback
  const functionPattern = /const\s+(\w+)\s*=\s*async\s*\(\s*\)\s*=>\s*\{/g;
  
  let match;
  const functionsToWrap = [];
  
  while ((match = functionPattern.exec(content)) !== null) {
    const funcName = match[1];
    // Check if this function is used in useEffect dependencies
    const useEffectPattern = new RegExp(`useEffect\\([^}]+\\}, \\[[^\\]]*${funcName}[^\\]]*\\]\\)`, 'g');
    if (useEffectPattern.test(content)) {
      functionsToWrap.push(funcName);
    }
  }
  
  // Wrap identified functions in useCallback
  functionsToWrap.forEach(funcName => {
    const funcPattern = new RegExp(`const\\s+${funcName}\\s*=\\s*async\\s*\\(\\s*\\)\\s*=>\\s*\\{`, 'g');
    content = content.replace(funcPattern, `const ${funcName} = useCallback(async () => {`);
    
    // Find the end of the function and add the dependency array
    // This is a simplified approach - in practice, you'd need more sophisticated parsing
    const lines = content.split('\n');
    let inFunction = false;
    let braceCount = 0;
    let functionStartLine = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(`const ${funcName} = useCallback(async () => {`)) {
        inFunction = true;
        functionStartLine = i;
        braceCount = 1;
        continue;
      }
      
      if (inFunction) {
        const openBraces = (lines[i].match(/\{/g) || []).length;
        const closeBraces = (lines[i].match(/\}/g) || []).length;
        braceCount += openBraces - closeBraces;
        
        if (braceCount === 0) {
          // End of function found
          lines[i] = lines[i].replace(/\};?$/, '}, []);');
          inFunction = false;
          break;
        }
      }
    }
    
    content = lines.join('\n');
  });
  
  return content;
}

// Function to process a single file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Apply fixes based on file type
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      content = fixSpecificAnyTypes(content);
      
      if (filePath.endsWith('.tsx')) {
        content = fixReactHookDependencies(content, filePath);
        content = wrapFunctionsInUseCallback(content);
      }
    }
    
    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Function to recursively find TypeScript/React files
function findFiles(dir, extensions = ['.ts', '.tsx']) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and other build directories
        if (!['node_modules', 'dist', 'build', '.git'].includes(item)) {
          traverse(fullPath);
        }
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Main execution
const srcDir = path.join(__dirname, 'src');
const files = findFiles(srcDir);

console.log(`Processing ${files.length} files...`);

// Focus on the most problematic files first
const priorityFiles = files.filter(file => 
  file.includes('pages/') || 
  file.includes('hooks/') || 
  file.includes('services/')
);

priorityFiles.forEach(processFile);

console.log('Done!');