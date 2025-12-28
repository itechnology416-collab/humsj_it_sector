#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Comprehensive list of files to process
const filesToProcess = [
  // Pages with many any type warnings
  'src/pages/AdminDashboard.tsx',
  'src/pages/AdminMemberManagement.tsx',
  'src/pages/Attendance.tsx',
  'src/pages/Auth.tsx',
  'src/pages/CommitteeManagement.tsx',
  'src/pages/Communication.tsx',
  'src/pages/Content.tsx',
  'src/pages/Courses.tsx',
  'src/pages/DataExport.tsx',
  'src/pages/DigitalDawaManagement.tsx',
  'src/pages/DiscussionForum.tsx',
  'src/pages/Donations.tsx',
  'src/pages/Events.tsx',
  'src/pages/FAQ.tsx',
  'src/pages/FacialRecognitionSettings.tsx',
  'src/pages/FastingTracker.tsx',
  'src/pages/Feedback.tsx',
  'src/pages/IslamicMeditation.tsx',
  'src/pages/IslamicNames.tsx',
  'src/pages/Leadership.tsx',
  'src/pages/LearningCenter.tsx',
  'src/pages/LoginActivity.tsx',
  'src/pages/Members.tsx',
  'src/pages/MyAttendance.tsx',
  'src/pages/MyEvents.tsx',
  'src/pages/News.tsx',
  'src/pages/NotFound.tsx',
  'src/pages/Partnerships.tsx',
  'src/pages/Profile.tsx',
  'src/pages/QiblaFinder.tsx',
  'src/pages/Reports.tsx',
  'src/pages/RoleManagement.tsx',
  'src/pages/Skills.tsx',
  'src/pages/SystemStatus.tsx',
  'src/pages/TajweedLessons.tsx',
  'src/pages/UserVerification.tsx',
  'src/pages/VirtualMosque.tsx',
  'src/pages/VolunteerOpportunities.tsx',
  'src/pages/Volunteers.tsx',
  'src/pages/WebhookManager.tsx',
  'src/pages/WebsiteContentManagement.tsx',
  'src/pages/ZakatCalculator.tsx',
  
  // Hooks with any type warnings
  'src/hooks/useCommittees.ts',
  'src/hooks/useCourses.ts',
  'src/hooks/useDawaContent.ts',
  'src/hooks/useEvents.ts',
  'src/hooks/useFAQ.ts',
  'src/hooks/useMembers.ts',
  'src/hooks/useMessages.ts',
  'src/hooks/useNews.ts',
  'src/hooks/useSystemMonitoring.ts',
  'src/hooks/useVolunteers.ts',
  'src/hooks/useWebsiteContent.ts',
  
  // Services with remaining any types
  'src/services/adminDashboardApi.ts',
  'src/services/analytics.ts',
  'src/services/apiIntegration.ts',
  'src/services/apiIntegrationManager.ts',
  'src/services/attendanceApi.ts',
  'src/services/committeeApi.ts',
  'src/services/communicationApi.ts',
  'src/services/donationsApi.ts',
  'src/services/errorHandler.ts',
  'src/services/facialRecognitionApi.ts',
  'src/services/halalMarketplaceApi.ts',
  'src/services/islamicCourseEnrollmentApi.ts',
  'src/services/islamicEducationApi.ts',
  'src/services/islamicFeaturesApi.ts',
  'src/services/libraryApi.ts',
  'src/services/memberApi.ts',
  'src/services/memberManagementApi.ts',
  'src/services/notificationService.ts',
  'src/services/offlineManager.ts',
  'src/services/prayerTimesApi.ts',
  'src/services/quranApi.ts',
  'src/services/reportsApi.ts',
  'src/services/supportApi.ts',
  'src/services/systemMonitoringApi.ts',
  'src/services/tasksApi.ts',
  'src/services/zakatCalculatorApi.ts',
  
  // Components with any types
  'src/components/study/SmartStudySystem.tsx',
  'src/components/ui/ImageUpload.tsx',
  'src/components/ui/VideoUpload.tsx'
];

// UI components with fast-refresh warnings
const uiComponentsToFix = [
  'src/components/ui/button.tsx',
  'src/components/ui/enhanced-button.tsx',
  'src/components/ui/form.tsx',
  'src/components/ui/navigation-menu.tsx',
  'src/components/ui/sidebar.tsx',
  'src/components/ui/sonner.tsx',
  'src/components/ui/toggle.tsx'
];

// Context files with fast-refresh warnings
const contextFilesToFix = [
  'src/contexts/AIContext.tsx',
  'src/contexts/AuthContext.tsx',
  'src/contexts/LanguageContext.tsx',
  'src/contexts/ThemeContext.tsx'
];

function fixAnyTypes(content) {
  return content
    // Replace Record<string, any> with Record<string, unknown>
    .replace(/Record<string,\s*any>/g, 'Record<string, unknown>')
    // Replace catch blocks
    .replace(/catch\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*\)/g, 'catch ($1: unknown)')
    // Replace function parameters
    .replace(/\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*\)/g, '($1: unknown)')
    // Replace variable declarations
    .replace(/:\s*any\s*=/g, ': unknown =')
    // Replace function parameter types in middle of parameter list
    .replace(/,\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any(?=\s*[,)])/g, ', $1: unknown')
    // Replace array types
    .replace(/:\s*any\[\]/g, ': unknown[]')
    // Replace generic types
    .replace(/<any>/g, '<unknown>')
    // Replace object property types
    .replace(/:\s*any(?=\s*[;}])/g, ': unknown')
    // Replace return types
    .replace(/\):\s*any(?=\s*[{=])/g, '): unknown')
    // Replace interface/type properties
    .replace(/:\s*any;/g, ': unknown;')
    // Replace as any with as unknown (but keep some specific cases)
    .replace(/as\s+any(?!\.__)/g, 'as unknown');
}

function fixReactHookDependencies(content, filePath) {
  // Add useCallback import if missing and needed
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

  // Fix common useEffect dependency patterns
  const patterns = [
    // Pattern: useEffect(() => { loadData(); }, []);
    {
      search: /useEffect\(\(\) => \{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\(\);?\s*\}, \[\]\);/g,
      replace: (match, funcName) => {
        return `useEffect(() => {
    ${funcName}();
  }, [${funcName}]);`;
      }
    },
    // Pattern: useEffect(() => { loadData(); }, [someVar]);
    {
      search: /useEffect\(\(\) => \{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\(\);?\s*\}, \[([^\]]+)\]\);/g,
      replace: (match, funcName, deps) => {
        if (!deps.includes(funcName)) {
          return `useEffect(() => {
    ${funcName}();
  }, [${deps}, ${funcName}]);`;
        }
        return match;
      }
    }
  ];

  patterns.forEach(pattern => {
    content = content.replace(pattern.search, pattern.replace);
  });

  return content;
}

function wrapFunctionInUseCallback(content, functionName, dependencies = []) {
  // Find the function definition
  const funcPattern = new RegExp(`const\\s+${functionName}\\s*=\\s*async\\s*\\([^)]*\\)\\s*=>\\s*\\{`, 'g');
  
  if (funcPattern.test(content)) {
    // Reset regex
    funcPattern.lastIndex = 0;
    
    content = content.replace(funcPattern, (match) => {
      return match.replace('const', 'const').replace('async', 'useCallback(async');
    });
    
    // Find the end of the function and add dependency array
    const lines = content.split('\n');
    let inFunction = false;
    let braceCount = 0;
    let functionStartLine = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(`const ${functionName} = useCallback(async`)) {
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
          const depsArray = dependencies.length > 0 ? `[${dependencies.join(', ')}]` : '[]';
          lines[i] = lines[i].replace(/\};?$/, `}, ${depsArray});`);
          inFunction = false;
          break;
        }
      }
    }
    
    content = lines.join('\n');
  }
  
  return content;
}

function fixFastRefreshWarnings(content, filePath) {
  // For UI components, extract constants to separate files or inline them
  if (filePath.includes('components/ui/')) {
    // Extract variant objects and similar constants
    const variantPattern = /export\s+const\s+([a-zA-Z_$][a-zA-Z0-9_$]*Variants?)\s*=\s*\{[^}]+\}/g;
    let match;
    const extractedConstants = [];
    
    while ((match = variantPattern.exec(content)) !== null) {
      extractedConstants.push(match[0]);
      content = content.replace(match[0], '');
    }
    
    // If we extracted constants, create a separate file
    if (extractedConstants.length > 0) {
      const componentName = path.basename(filePath, '.tsx');
      const constantsFileName = `${componentName}-variants.ts`;
      const constantsPath = path.join(path.dirname(filePath), constantsFileName);
      
      const constantsContent = `// Auto-generated constants file to fix fast-refresh warnings
${extractedConstants.join('\n\n')}
`;
      
      fs.writeFileSync(constantsPath, constantsContent);
      
      // Add import to original file
      const importStatement = `import { ${extractedConstants.map(c => c.match(/const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/)[1]).join(', ')} } from './${constantsFileName.replace('.ts', '')}';\n`;
      content = importStatement + content;
    }
  }
  
  return content;
}

function processFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Apply fixes based on file type and content
    content = fixAnyTypes(content);
    
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      if (filePath.includes('pages/') || filePath.includes('hooks/')) {
        content = fixReactHookDependencies(content, filePath);
      }
      
      if (filePath.includes('components/ui/') || filePath.includes('contexts/')) {
        content = fixFastRefreshWarnings(content, filePath);
      }
    }
    
    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔧 Starting comprehensive warning fixes...\n');
  
  let processedCount = 0;
  let fixedCount = 0;
  
  // Process all files
  const allFiles = [...filesToProcess, ...uiComponentsToFix, ...contextFilesToFix];
  
  for (const filePath of allFiles) {
    processedCount++;
    if (processFile(filePath)) {
      fixedCount++;
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Files processed: ${processedCount}`);
  console.log(`   Files fixed: ${fixedCount}`);
  console.log(`   Files skipped: ${processedCount - fixedCount}`);
  console.log('\n✨ Comprehensive warning fixes completed!');
  
  // Run lint check to see progress
  console.log('\n🔍 Running lint check to verify progress...');
  const { execSync } = require('child_process');
  try {
    const result = execSync('npm run lint', { encoding: 'utf8', stdio: 'pipe' });
    console.log('✅ No lint errors found!');
  } catch (error) {
    const output = error.stdout || error.stderr || '';
    const problemsMatch = output.match(/(\d+) problems/);
    if (problemsMatch) {
      console.log(`📈 Current status: ${problemsMatch[1]} problems remaining`);
    }
  }
}

main();