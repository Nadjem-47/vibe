"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type TreeItem = string | [string, ...TreeItem[]];

interface TreeViewProps {
  data: TreeItem[];
  value?: string | null;
  onSelect?: (path: string) => void;
}

interface TreeNodeProps {
  item: TreeItem;
  level?: number;
  path?: string;
  value?: string | null;
  onSelect?: (path: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ 
  item, 
  level = 0, 
  path = "", 
  value, 
  onSelect 
}) => {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  
  if (typeof item === "string") {
    // This is a file
    const fullPath = path ? `${path}/${item}` : item;
    const isSelected = value === fullPath;
    
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1 text-sm cursor-pointer rounded-md transition-colors",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          isSelected && "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect?.(fullPath)}
      >
        <File className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
        <span className="truncate">{item}</span>
      </div>
    );
  }

  // This is a folder
  const [folderName, ...children] = item;
  const fullPath = path ? `${path}/${folderName}` : folderName;
  const hasChildren = children.length > 0;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1 text-sm cursor-pointer rounded-md transition-colors",
          "hover:bg-gray-100 dark:hover:bg-gray-800"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          )
        ) : (
          <div className="w-4 h-4 flex-shrink-0" />
        )}
        {isExpanded ? (
          <FolderOpen className="w-4 h-4 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
        ) : (
          <Folder className="w-4 h-4 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
        )}
        <span className="truncate font-medium">{folderName}</span>
      </div>
      
      {isExpanded && hasChildren && (
        <div>
          {children.map((child, index) => (
            <TreeNode
              key={`${fullPath}-${index}`}
              item={child}
              level={level + 1}
              path={fullPath}
              value={value}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const TreeView: React.FC<TreeViewProps> = ({ data, value, onSelect }) => {

    
  return (
    <div className="h-full overflow-auto p-2">
      <div className="space-y-1">
        {data.map((item, index) => (
          <TreeNode
            key={index}
            item={item}
            value={value}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};
