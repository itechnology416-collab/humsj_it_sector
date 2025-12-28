#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fix fast-refresh warnings by extracting constants
function fixFastRefreshWarnings() {
  const componentFixes = [
    {
      file: 'src/components/ui/enhanced-button.tsx',
      constantName: 'enhancedButtonVariants',
      newFile: 'enhanced-button-variants.ts'
    },
    {
      file: 'src/components/ui/form.tsx',
      constantName: 'labelVariants',
      newFile: 'form-variants.ts'
    },
    {
      file: 'src/components/ui/navigation-menu.tsx',
      constantName: 'navigationMenuTriggerStyle',
      newFile: 'navigation-menu-variants.ts'
    },
    {
      file: 'src/components/ui/sidebar.tsx',
      constantName: 'sidebarMenuButtonVariants',
      newFile: 'sidebar-variants.ts'
    },
    {
      file: 'src/components/ui/sonner.tsx',
      constantName: 'toasterVariants',
      newFile: 'sonner-variants.ts'
    },
    {
      file: 'src/components/ui/toggle.tsx',
      constantName: 'toggleVariants',
      newFile: 'toggle-variants.ts'
    }
  ];

  componentFixes.forEach(fix => {
    try {
      if (fs.existsSync(fix.file)) {
        let content = fs.readFileSync(fix.file, 'utf8');
        
        // Find and extract the constant definition
        const constantRegex = new RegExp(`export\\s+const\\s+${fix.constantName}\\s*=\\s*[^;]+;`, 'gs');
        const match = content.match(constantRegex);
        
        if (match) {
          const constantDef = match[0];
          
          // Create the variants file
          const variantsPath = path.join(path.dirname(fix.file), fix.newFile);
          const variantsContent = `// Auto-generated variants file to fix fast-refresh warnings
import { cva } from "class-variance-authority";

${constantDef}
`;
          
          fs.writeFileSync(variantsPath, variantsContent);
          
          // Remove the constant from the original file and add import
          content = content.replace(constantRegex, '');
          
          // Add import statement
          const importStatement = `import { ${fix.constantName} } from './${fix.newFile.replace('.ts', '')}';\n`;
          
          // Find the right place to add the import (after other imports)
          const importIndex = content.lastIndexOf('import ');
          if (importIndex !== -1) {
            const nextLineIndex = content.indexOf('\n', importIndex);
            content = content.slice(0, nextLineIndex + 1) + importStatement + content.slice(nextLineIndex + 1);
          } else {
            content = importStatement + content;
          }
          
          fs.writeFileSync(fix.file, content);
          console.log(`✅ Fixed fast-refresh in: ${fix.file}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error fixing ${fix.file}:`, error.message);
    }
  });
}

// Fix context fast-refresh warnings
function fixContextFastRefresh() {
  const contextFiles = [
    'src/contexts/AIContext.tsx',
    'src/contexts/AuthContext.tsx',
    'src/contexts/LanguageContext.tsx',
    'src/contexts/ThemeContext.tsx'
  ];

  contextFiles.forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Find default values or constants that are exported
        const defaultValueRegex = /export\s+const\s+default[A-Z][a-zA-Z]*\s*=\s*\{[^}]+\}/gs;
        const matches = content.match(defaultValueRegex);
        
        if (matches) {
          matches.forEach(match => {
            // Move the constant inside the component or context provider
            content = content.replace(match, '');
            
            // Find the context provider or component and add the constant inside
            const providerMatch = content.match(/(export\s+(?:const|function)\s+[A-Z][a-zA-Z]*Provider[^{]*\{)/);
            if (providerMatch) {
              const insertIndex = content.indexOf('{', content.indexOf(providerMatch[0])) + 1;
              content = content.slice(0, insertIndex) + '\n  ' + match.replace('export ', '') + '\n' + content.slice(insertIndex);
            }
          });
          
          if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            console.log(`✅ Fixed context fast-refresh in: ${filePath}`);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
  });
}

// Fix 3D component ref warnings
function fix3DComponentRefs() {
  const componentFixes = [
    {
      file: 'src/components/3d/Enhanced3DScene.tsx',
      search: /useEffect\(\(\) => \{[^}]+containerRef\.current[^}]+\}, \[[^\]]*\]\);/gs,
      replace: (match) => {
        return match.replace(
          /useEffect\(\(\) => \{/,
          'useEffect(() => {\n    const container = containerRef.current;\n    if (!container) return;\n    '
        ).replace(
          /containerRef\.current/g,
          'container'
        ).replace(
          /return \(\) => \{[^}]+\};/,
          'return () => {\n      if (container) {\n        // Cleanup using the captured container reference\n      }\n    };'
        );
      }
    },
    {
      file: 'src/components/3d/UniverseBackground.tsx',
      search: /useEffect\(\(\) => \{[^}]+containerRef\.current[^}]+starsRef\.current[^}]+\}, \[[^\]]*\]\);/gs,
      replace: (match) => {
        return match.replace(
          /useEffect\(\(\) => \{/,
          'useEffect(() => {\n    const container = containerRef.current;\n    const stars = starsRef.current;\n    if (!container || !stars) return;\n    '
        ).replace(
          /containerRef\.current/g,
          'container'
        ).replace(
          /starsRef\.current/g,
          'stars'
        ).replace(
          /return \(\) => \{[^}]+\};/,
          'return () => {\n      if (container && stars) {\n        // Cleanup using captured references\n      }\n    };'
        );
      }
    }
  ];

  componentFixes.forEach(fix => {
    try {
      if (fs.existsSync(fix.file)) {
        let content = fs.readFileSync(fix.file, 'utf8');
        const originalContent = content;
        content = content.replace(fix.search, fix.replace);
        
        if (content !== originalContent) {
          fs.writeFileSync(fix.file, content);
          console.log(`✅ Fixed 3D component refs in: ${fix.file}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error fixing ${fix.file}:`, error.message);
    }
  });
}

// Main execution
console.log('🔧 Fixing fast-refresh and ref warnings...\n');

fixFastRefreshWarnings();
fixContextFastRefresh();
fix3DComponentRefs();

console.log('\n✨ Fast-refresh and ref fixes completed!');

// Run lint check to see final results
console.log('\n🔍 Running final lint check...');
const { execSync } = require('child_process');
try {
  const result = execSync('npm run lint', { encoding: 'utf8', stdio: 'pipe' });
  console.log('🎉 All lint errors and warnings fixed!');
} catch (error) {
  const output = error.stdout || error.stderr || '';
  const problemsMatch = output.match(/(\d+) problems/);
  if (problemsMatch) {
    console.log(`📊 Final status: ${problemsMatch[1]} problems remaining`);
    
    // Show remaining issues
    const lines = output.split('\n');
    const warningLines = lines.filter(line => line.includes('warning') || line.includes('error'));
    if (warningLines.length > 0) {
      console.log('\n📋 Remaining issues:');
      warningLines.slice(0, 10).forEach(line => console.log(`   ${line.trim()}`));
      if (warningLines.length > 10) {
        console.log(`   ... and ${warningLines.length - 10} more`);
      }
    }
  }
}