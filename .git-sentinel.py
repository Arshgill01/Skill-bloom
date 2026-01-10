#!/usr/bin/env python3
"""
Git Sentinel - Intelligent Version Control Monitor
Generates semantic commit messages by analyzing actual code changes.
"""

import subprocess
import time
import re
from datetime import datetime
from pathlib import Path

def run_git(cmd):
    """Run a git command and return output."""
    result = subprocess.run(
        f"git {cmd}",
        shell=True,
        capture_output=True,
        text=True,
        cwd=Path(__file__).parent
    )
    return result.stdout.strip(), result.returncode

def get_changed_files():
    """Get list of changed files with their status."""
    output, _ = run_git("status --porcelain")
    if not output:
        return []
    
    changes = []
    for line in output.split('\n'):
        if line:
            status = line[:2].strip()
            filepath = line[3:]
            changes.append((status, filepath))
    return changes

def analyze_diff(filepath):
    """Analyze diff content to extract meaningful changes."""
    diff_output, _ = run_git(f"diff HEAD -- \"{filepath}\"")
    if not diff_output:
        diff_output, _ = run_git(f"diff --cached -- \"{filepath}\"")
    
    insights = {
        'added_functions': [],
        'modified_functions': [],
        'added_imports': [],
        'added_exports': [],
        'key_changes': []
    }
    
    # Extract function/component definitions
    func_pattern = r'^\+\s*(export\s+)?(async\s+)?function\s+(\w+)'
    const_func_pattern = r'^\+\s*(export\s+)?const\s+(\w+)\s*=\s*(\([^)]*\)|async\s*\([^)]*\))\s*=>'
    component_pattern = r'^\+\s*(export\s+)?(default\s+)?function\s+([A-Z]\w+)'
    hook_pattern = r'^\+\s*(export\s+)?const\s+(use\w+)\s*='
    interface_pattern = r'^\+\s*(export\s+)?interface\s+(\w+)'
    type_pattern = r'^\+\s*(export\s+)?type\s+(\w+)'
    import_pattern = r'^\+\s*import\s+.*from\s+[\'"]([^\'"]+)[\'"]'
    
    for line in diff_output.split('\n'):
        # Check for function additions
        match = re.match(func_pattern, line)
        if match:
            insights['added_functions'].append(match.group(3))
            continue
        
        # Check for arrow function components/hooks
        match = re.match(const_func_pattern, line)
        if match:
            insights['added_functions'].append(match.group(2))
            continue
            
        # Check for React components
        match = re.match(component_pattern, line)
        if match:
            insights['added_functions'].append(match.group(3))
            continue
            
        # Check for hooks
        match = re.match(hook_pattern, line)
        if match:
            insights['added_functions'].append(match.group(2))
            continue
            
        # Check for interfaces/types
        match = re.match(interface_pattern, line)
        if match:
            insights['key_changes'].append(f"interface {match.group(2)}")
            continue
            
        match = re.match(type_pattern, line)
        if match:
            insights['key_changes'].append(f"type {match.group(2)}")
            continue
            
        # Check for new imports
        match = re.match(import_pattern, line)
        if match:
            insights['added_imports'].append(match.group(1))
    
    return insights

def get_file_category(filepath):
    """Categorize file by its path/type."""
    path = filepath.lower()
    
    if 'component' in path:
        return 'components'
    elif 'hook' in path or path.startswith('hooks/'):
        return 'hooks'
    elif 'api/' in path or 'route' in path:
        return 'api'
    elif 'app/' in path and 'layout' in path:
        return 'layout'
    elif 'app/' in path and 'page' in path:
        return 'pages'
    elif 'types/' in path or path.endswith('.d.ts'):
        return 'types'
    elif 'utils/' in path or 'lib/' in path:
        return 'utils'
    elif 'styles/' in path or path.endswith('.css'):
        return 'styles'
    elif path.endswith('.json'):
        return 'config'
    elif path.endswith('.md'):
        return 'docs'
    else:
        return None

def generate_commit_message(changes):
    """Generate a semantic commit message based on analyzed changes."""
    if not changes:
        return None
    
    added_files = [c[1] for c in changes if c[0] in ('??', 'A')]
    modified_files = [c[1] for c in changes if c[0] in ('M', 'MM')]
    deleted_files = [c[1] for c in changes if c[0] == 'D']
    
    all_insights = {'added_functions': [], 'key_changes': [], 'added_imports': []}
    
    # Analyze each changed file
    for _, filepath in changes:
        if filepath.endswith(('.ts', '.tsx', '.js', '.jsx')):
            insights = analyze_diff(filepath)
            all_insights['added_functions'].extend(insights['added_functions'])
            all_insights['key_changes'].extend(insights['key_changes'])
            all_insights['added_imports'].extend(insights['added_imports'])
    
    # Determine commit type and scope
    categories = [get_file_category(f) for _, f in changes]
    categories = [c for c in categories if c]
    primary_category = categories[0] if categories else None
    
    # Determine type
    if added_files and not modified_files:
        commit_type = 'feat'
    elif deleted_files and not added_files and not modified_files:
        commit_type = 'refactor'
    elif any('fix' in f.lower() or 'bug' in f.lower() for _, f in changes):
        commit_type = 'fix'
    elif primary_category == 'docs':
        commit_type = 'docs'
    elif primary_category == 'config':
        commit_type = 'chore'
    elif primary_category == 'styles':
        commit_type = 'style'
    else:
        commit_type = 'feat'
    
    # Build scope
    scope = f"({primary_category})" if primary_category else ""
    
    # Build description
    description_parts = []
    
    # New functions/components
    if all_insights['added_functions']:
        funcs = all_insights['added_functions'][:3]  # Limit to 3
        if len(funcs) == 1:
            description_parts.append(f"add {funcs[0]}")
        else:
            description_parts.append(f"add {', '.join(funcs)}")
    
    # New files
    if added_files:
        basenames = [Path(f).stem for f in added_files[:2]]
        if not description_parts:
            description_parts.append(f"add {', '.join(basenames)}")
    
    # Modified files
    if modified_files and not description_parts:
        if len(modified_files) == 1:
            basename = Path(modified_files[0]).stem
            description_parts.append(f"update {basename}")
        else:
            basenames = [Path(f).stem for f in modified_files[:2]]
            description_parts.append(f"update {', '.join(basenames)}")
    
    # Deleted files
    if deleted_files:
        basenames = [Path(f).stem for f in deleted_files[:2]]
        if description_parts:
            description_parts.append(f"remove {', '.join(basenames)}")
        else:
            description_parts.append(f"remove {', '.join(basenames)}")
    
    # Key changes (interfaces, types)
    if all_insights['key_changes'] and not description_parts:
        description_parts.append(f"add {', '.join(all_insights['key_changes'][:2])}")
    
    # Fallback
    if not description_parts:
        file_count = len(changes)
        description_parts.append(f"update {file_count} file{'s' if file_count > 1 else ''}")
    
    description = '; '.join(description_parts)
    
    return f"{commit_type}{scope}: {description}"

def main():
    print(f"🔍 Git Sentinel (Smart) started at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📁 Monitoring: {Path(__file__).parent}")
    print("─" * 50)
    
    while True:
        changes = get_changed_files()
        
        if changes:
            timestamp = datetime.now().strftime('%H:%M:%S')
            print(f"\n✓ [{timestamp}] Changes detected:")
            for status, filepath in changes:
                status_icon = {'M': '📝', 'D': '🗑️', '??': '✨', 'A': '✨'}.get(status, '📄')
                print(f"  {status_icon} {filepath}")
            
            # Stage all changes
            run_git("add -A")
            
            # Generate smart commit message
            commit_msg = generate_commit_message(changes)
            
            # Commit
            output, code = run_git(f'commit -m "{commit_msg}"')
            
            if code == 0:
                commit_hash, _ = run_git("rev-parse --short HEAD")
                print(f"  ✅ Committed: {commit_hash}")
                print(f"  📝 Message: {commit_msg}")
            else:
                print(f"  ⚠️ Commit failed: {output}")
        else:
            timestamp = datetime.now().strftime('%H:%M:%S')
            print(f"[{timestamp}] No changes", end='\r')
        
        time.sleep(30)

if __name__ == "__main__":
    main()
