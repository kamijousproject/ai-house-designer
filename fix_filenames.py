import os
import shutil

# Fix source files
source_dir = r'assets\images\hero'
for filename in os.listdir(source_dir):
    if filename.startswith(' '):
        old_path = os.path.join(source_dir, filename)
        new_filename = filename.lstrip()
        new_path = os.path.join(source_dir, new_filename)
        print(f'Renaming: {filename} -> {new_filename}')
        os.rename(old_path, new_path)

# Copy corrected files to public
src = r'assets\images\hero'
dst = r'public\ai-house-designer\assets\images\hero'

# Remove old files in destination
if os.path.exists(dst):
    for f in os.listdir(dst):
        os.remove(os.path.join(dst, f))
        
# Copy files
for filename in os.listdir(src):
    if filename.endswith('.webp'):
        shutil.copy2(os.path.join(src, filename), os.path.join(dst, filename))
        print(f'Copied: {filename}')

print('Done!')
