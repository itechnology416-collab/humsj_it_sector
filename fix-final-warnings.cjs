#!/usr/bin/env node

const fs = require('fs');

// Fix specific remaining issues
function fixSpecificIssues() {
  const fixes = [
    // Fix remaining any types in specific files
    {
      file: 'src/pages/MyEvents.tsx',
      search: /setEvents\(([^)]+): any\)/g,
      replace: 'setEvents($1: unknown)'
    },
    {
      file: 'src/pages/Reports.tsx',
      search: /: any\[\]/g,
      replace: ': unknown[]'
    },
    {
      file: 'src/pages/Reports.tsx',
      search: /: any\s*=/g,
      replace: ': unknown ='
    },
    {
      file: 'src/pages/SystemStatus.tsx',
      search: /: any\s*=/g,
      replace: ': unknown ='
    },
    {
      file: 'src/services/attendanceApi.ts',
      search: /: any/g,
      replace: ': unknown'
    },
    {
      file: 'src/services/communicationApi.ts',
      search: /: any/g,
      replace: ': unknown'
    },
    {
      file: 'src/services/facialRecognitionApi.ts',
      search: /: any/g,
      replace: ': unknown'
    },
    {
      file: 'src/services/memberApi.ts',
      search: /: any/g,
      replace: ': unknown'
    },
    {
      file: 'src/services/memberManagementApi.ts',
      search: /: any/g,
      replace: ': unknown'
    },
    {
      file: 'src/services/reportsApi.ts',
      search: /: any/g,
      replace: ': unknown'
    }
  ];

  fixes.forEach(fix => {
    try {
      if (fs.existsSync(fix.file)) {
        let content = fs.readFileSync(fix.file, 'utf8');
        const originalContent = content;
        content = content.replace(fix.search, fix.replace);
        
        if (content !== originalContent) {
          fs.writeFileSync(fix.file, content);
          console.log(`✅ Fixed any types in: ${fix.file}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error fixing ${fix.file}:`, error.message);
    }
  });
}

// Fix React Hook dependency issues
function fixReactHookDependencies() {
  const hookFixes = [
    {
      file: 'src/components/ui/ImageUpload.tsx',
      search: /const validateFile = \([^}]+\};/gs,
      replace: (match) => {
        return `const validateFile = useCallback(${match.replace('const validateFile = ', '')}, [acceptedFormats, maxSize]);`;
      }
    },
    {
      file: 'src/components/ui/VideoUpload.tsx',
      search: /const validateFile = \([^}]+\};/gs,
      replace: (match) => {
        return `const validateFile = useCallback(${match.replace('const validateFile = ', '')}, [acceptedFormats, maxSize]);`;
      }
    }
  ];

  hookFixes.forEach(fix => {
    try {
      if (fs.existsSync(fix.file)) {
        let content = fs.readFileSync(fix.file, 'utf8');
        const originalContent = content;
        
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
        
        content = content.replace(fix.search, fix.replace);
        
        if (content !== originalContent) {
          fs.writeFileSync(fix.file, content);
          console.log(`✅ Fixed React hooks in: ${fix.file}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error fixing ${fix.file}:`, error.message);
    }
  });
}

// Fix useCallback dependency issues in pages
function fixPageHookDependencies() {
  const pageFiles = [
    'src/pages/Content.tsx',
    'src/pages/Courses.tsx',
    'src/pages/FAQ.tsx',
    'src/pages/LearningCenter.tsx',
    'src/pages/Members.tsx',
    'src/pages/MyEvents.tsx',
    'src/pages/News.tsx',
    'src/pages/Profile.tsx',
    'src/pages/UserVerification.tsx',
    'src/pages/VolunteerOpportunities.tsx'
  ];

  pageFiles.forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Add useCallback import if missing
        if (content.includes('useEffect') && !content.includes('useCallback')) {
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
        
        // Wrap loadData functions in useCallback
        content = content.replace(
          /const\s+(loadData|fetchContent|fetchProfile)\s*=\s*async\s*\(\s*\)\s*=>\s*\{/g,
          'const $1 = useCallback(async () => {'
        );
        
        // Add dependency arrays to useCallback functions
        const lines = content.split('\n');
        let inFunction = false;
        let braceCount = 0;
        let functionName = '';
        
        for (let i = 0; i < lines.length; i++) {
          const callbackMatch = lines[i].match(/const\s+(loadData|fetchContent|fetchProfile)\s*=\s*useCallback\(async\s*\(\s*\)\s*=>\s*\{/);
          if (callbackMatch) {
            inFunction = true;
            functionName = callbackMatch[1];
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
        
        if (content !== originalContent) {
          fs.writeFileSync(filePath, content);
          console.log(`✅ Fixed page hooks in: ${filePath}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
  });
}

// Fix missing dependencies in specific useEffect hooks
function fixMissingDependencies() {
  const dependencyFixes = [
    {
      file: 'src/pages/DigitalDawaManagement.tsx',
      search: /useEffect\(\(\) => \{\s*loadData\(\);\s*\}, \[\]\);/,
      replace: 'useEffect(() => { loadData(); }, [loadData]);'
    },
    {
      file: 'src/pages/FacialRecognitionSettings.tsx',
      search: /useEffect\(\(\) => \{\s*loadUserData\(\);\s*\}, \[\]\);/,
      replace: 'useEffect(() => { loadUserData(); }, [loadUserData]);'
    },
    {
      file: 'src/pages/LoginActivity.tsx',
      search: /useEffect\(\(\) => \{\s*loadData\(\);\s*\}, \[\]\);/,
      replace: 'useEffect(() => { loadData(); }, [loadData]);'
    },
    {
      file: 'src/pages/WebsiteContentManagement.tsx',
      search: /useEffect\(\(\) => \{\s*loadData\(\);\s*\}, \[\]\);/,
      replace: 'useEffect(() => { loadData(); }, [loadData]);'
    },
    {
      file: 'src/pages/SystemStatus.tsx',
      search: /useCallback\(async \(\) => \{[^}]+\}, \[fetchMetrics, logs\]\);/gs,
      replace: (match) => {
        return match.replace('[fetchMetrics, logs]', '[fetchMetrics, logs, processHealthCheckData, processIncidentsFromLogs]');
      }
    }
  ];

  dependencyFixes.forEach(fix => {
    try {
      if (fs.existsSync(fix.file)) {
        let content = fs.readFileSync(fix.file, 'utf8');
        const originalContent = content;
        content = content.replace(fix.search, fix.replace);
        
        if (content !== originalContent) {
          fs.writeFileSync(fix.file, content);
          console.log(`✅ Fixed dependencies in: ${fix.file}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error fixing ${fix.file}:`, error.message);
    }
  });
}

// Main execution
console.log('🔧 Fixing final remaining warnings...\n');

fixSpecificIssues();
fixReactHookDependencies();
fixPageHookDependencies();
fixMissingDependencies();

console.log('\n✨ Final warning fixes completed!');

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
  }
}