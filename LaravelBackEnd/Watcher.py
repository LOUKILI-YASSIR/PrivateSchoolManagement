import os
import fnmatch

def load_gitignore_patterns(base_path):
    gitignore_path = os.path.join(base_path, ".gitignore")
    # Default Laravel-specific ignore patterns
    patterns = [
        "vendor/",
        ".env",
        ".env.*",
        "storage/framework/",
        "storage/logs/",
        "storage/cache/",
        "node_modules/",
        "public/build/",
        "public/hot",
        "public/storage",
        "*.log",
        "composer.lock",
        "package-lock.json",
        ".git/",
        "Homestead.yaml",
        "Homestead.json",
        "phpunit.xml"
    ]
    # Load additional patterns from .gitignore if it exists
    if os.path.exists(gitignore_path):
        with open(gitignore_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    patterns.append(line)
    return patterns

def is_ignored(path, patterns):
    # Check if path matches any ignore pattern
    for pattern in patterns:
        # Handle directory patterns with trailing slash
        if pattern.endswith("/"):
            if os.path.isdir(path) and fnmatch.fnmatch(os.path.basename(path) + "/", pattern):
                return True
            if fnmatch.fnmatch(path, pattern + "**"):
                return True
        # Handle file patterns
        if fnmatch.fnmatch(path, pattern) or fnmatch.fnmatch(os.path.basename(path), pattern):
            return True
    return False

def get_icon(name, is_dir):
    folder_icon = "📂"
    file_icon = "📄"
    # Extended icons for Laravel-specific files
    icons = {
        ".php": "🐘",    # PHP files (Laravel's primary language)
        ".blade.php": "🖼️",  # Blade templates
        ".md": "📝",
        ".json": "🔧",
        ".yaml": "⚙️",
        ".yml": "⚙️",
        ".html": "🌐",
        ".css": "🎨",
        ".js": "📜",
        ".gitignore": "🚫",
        ".txt": "📖",
        ".lock": "🔒",
        ".config": "🛠️"
    }
    if is_dir:
        return folder_icon
    ext = os.path.splitext(name)[1]
    # Handle .blade.php specifically since it has a compound extension
    if name.endswith(".blade.php"):
        return icons.get(".blade.php", file_icon)
    return icons.get(ext, file_icon)

def scan_directory(base_path, ignore_patterns, prefix=""):
    structure = ""
    try:
        entries = sorted(os.listdir(base_path))
    except PermissionError:
        return ""
    # Filter out ignored entries
    entries = [e for e in entries if not is_ignored(os.path.join(base_path, e), ignore_patterns)]
    
    for i, entry in enumerate(entries):
        path = os.path.join(base_path, entry)
        is_dir = os.path.isdir(path)
        icon = get_icon(entry, is_dir)
        connector = "├── " if i < len(entries) - 1 else "└── "
        structure += f"{prefix}{connector}{icon} {entry}\n"
        
        if is_dir:
            new_prefix = prefix + ("│   " if i < len(entries) - 1 else "    ")
            structure += scan_directory(path, ignore_patterns, new_prefix)
    
    return structure

def main():
    project_root = os.getcwd()  # Set to desired directory
    ignore_patterns = load_gitignore_patterns(project_root)
    structure = scan_directory(project_root, ignore_patterns)
    
    with open("laravel_project_structure.txt", "w", encoding="utf-8") as f:
        f.write("Laravel Project Structure:\n")
        f.write(structure)
    
    print("Laravel project structure saved to laravel_project_structure.txt")

if __name__ == "__main__":
    main()