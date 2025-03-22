import os
import fnmatch

def load_gitignore_patterns(base_path):
    gitignore_path = os.path.join(base_path, ".gitignore")
    patterns = []
    if os.path.exists(gitignore_path):
        with open(gitignore_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    patterns.append(line)
    return patterns

def is_ignored(path, patterns):
    for pattern in patterns:
        if fnmatch.fnmatch(path, pattern) or fnmatch.fnmatch(os.path.basename(path), pattern):
            return True
    return False

def get_icon(name, is_dir):
    folder_icon = "📂"
    file_icon = "📄"
    icons = {
        ".py": "🐍",
        ".md": "📝",
        ".json": "🔧",
        ".yaml": "⚙️",
        ".yml": "⚙️",
        ".html": "🌐",
        ".css": "🎨",
        ".js": "📜",
        ".gitignore": "🚫",
        ".txt": "📖",
    }
    if is_dir:
        return folder_icon
    ext = os.path.splitext(name)[1]
    return icons.get(ext, file_icon)

def scan_directory(base_path, ignore_patterns, prefix=""):  
    structure = ""
    try:
        entries = sorted(os.listdir(base_path))
    except PermissionError:
        return ""
    entries = [e for e in entries if not is_ignored(e, ignore_patterns)]
    
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
    
    with open("project_structure.txt", "w", encoding="utf-8") as f:
        f.write("Project Structure:\n")
        f.write(structure)
    
    print("Project structure saved to project_structure.txt")

if __name__ == "__main__":
    main()
