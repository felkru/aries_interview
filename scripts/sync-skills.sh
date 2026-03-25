#!/bin/bash

# Define paths
SOURCE_DIR_ROOT=".agents"
TARGET_DIR=".claude/skills"

# Ensure target directory exists
mkdir -p "$TARGET_DIR"

echo "Searching for skills in $SOURCE_DIR_ROOT..."

# Find all files named SKILL.md under .agents
find "$SOURCE_DIR_ROOT" -name "SKILL.md" | while read skill_file; do
  skill_dir=$(dirname "$skill_file")
  
  # Try to extract the skill name from the name: field in the SKILL.md frontmatter
  # This matches lines like "name: my-skill" or "name: 'my-skill'"
  skill_name=$(grep "^name:" "$skill_file" | head -n 1 | sed 's/name:[[:space:]]*//' | tr -d '"'\'' ')
  
  # Fallback to the directory name if name isn't found in the file
  if [ -z "$skill_name" ]; then
    skill_name=$(basename "$skill_dir")
  fi

  # Skip if skill_name is "references" - use parent dir name instead if that happens
  if [ "$skill_name" == "references" ]; then
     parent_dir=$(basename "$(dirname "$skill_dir")")
     skill_name="$parent_dir"
  fi

  target_link="$TARGET_DIR/$skill_name"
  relative_source="../../$skill_dir"

  # Create or update the symlink
  if [ -L "$target_link" ]; then
    current_target=$(readlink "$target_link")
    if [ "$current_target" == "$relative_source" ]; then
      echo "$skill_name is already correctly linked."
    else
      echo "Updating $skill_name -> $skill_dir..."
      rm "$target_link"
      ln -s "$relative_source" "$target_link"
    fi
  elif [ -e "$target_link" ]; then
    echo "Warning: $target_link exists and is not a symlink. Skipping."
  else
    echo "Linking $skill_name -> $skill_dir..."
    ln -s "$relative_source" "$target_link"
  fi
done

echo "Skill synchronization complete."
