import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit3, Eye, Palette, Move, Square } from "lucide-react";

interface ElementEditorProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function ElementEditor({ isEnabled, onToggle }: ElementEditorProps) {
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isEnabled) {
      document.body.classList.add('element-editor-mode');
      
      const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const target = e.target as HTMLElement;
        if (target.closest('.element-editor-toolbar')) return;
        
        setSelectedElement(target);
        setEditorPosition({ x: e.clientX, y: e.clientY });
      };
      
      document.addEventListener('click', handleClick, true);
      
      return () => {
        document.removeEventListener('click', handleClick, true);
      };
    } else {
      document.body.classList.remove('element-editor-mode');
      setSelectedElement(null);
    }
  }, [isEnabled]);

  const updateElementStyle = (property: string, value: string) => {
    if (selectedElement) {
      selectedElement.style.setProperty(property, value);
    }
  };

  const addPadding = (amount: string) => {
    updateElementStyle('padding', amount);
  };

  const addMargin = (amount: string) => {
    updateElementStyle('margin', amount);
  };

  const setBackgroundColor = (color: string) => {
    updateElementStyle('background-color', color);
  };

  const setBorderRadius = (radius: string) => {
    updateElementStyle('border-radius', radius);
  };

  const setBorder = (border: string) => {
    updateElementStyle('border', border);
  };

  if (!isEnabled) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => onToggle(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          size="lg"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Enable Element Editor
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Main Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => onToggle(false)}
          className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
          size="lg"
        >
          <Eye className="h-4 w-4 mr-2" />
          Disable Element Editor
        </Button>
      </div>

      {/* Element Editor Toolbar */}
      {selectedElement && (
        <div 
          className="element-editor-toolbar fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 min-w-80"
          style={{ 
            left: Math.min(editorPosition.x, window.innerWidth - 320),
            top: Math.max(editorPosition.y - 200, 10)
          }}
        >
          <div className="mb-3">
            <Badge variant="outline" className="text-xs">
              {selectedElement.tagName.toLowerCase()}
            </Badge>
            {selectedElement.className && (
              <Badge variant="secondary" className="text-xs ml-2">
                .{selectedElement.className.split(' ')[0]}
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            {/* Padding Controls */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Square className="h-3 w-3" />
                Padding
              </label>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => addPadding('0px')}>
                  None
                </Button>
                <Button size="sm" variant="outline" onClick={() => addPadding('8px')}>
                  Small
                </Button>
                <Button size="sm" variant="outline" onClick={() => addPadding('16px')}>
                  Medium
                </Button>
                <Button size="sm" variant="outline" onClick={() => addPadding('24px')}>
                  Large
                </Button>
              </div>
            </div>

            {/* Margin Controls */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Move className="h-3 w-3" />
                Margin
              </label>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => addMargin('0px')}>
                  None
                </Button>
                <Button size="sm" variant="outline" onClick={() => addMargin('8px')}>
                  Small
                </Button>
                <Button size="sm" variant="outline" onClick={() => addMargin('16px')}>
                  Medium
                </Button>
                <Button size="sm" variant="outline" onClick={() => addMargin('24px')}>
                  Large
                </Button>
              </div>
            </div>

            {/* Background Color */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-2">
                <Palette className="h-3 w-3" />
                Background
              </label>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={() => setBackgroundColor('transparent')}>
                  None
                </Button>
                <Button size="sm" variant="outline" onClick={() => setBackgroundColor('#f3f4f6')}>
                  Gray
                </Button>
                <Button size="sm" variant="outline" onClick={() => setBackgroundColor('#dbeafe')}>
                  Blue
                </Button>
                <Button size="sm" variant="outline" onClick={() => setBackgroundColor('#dcfce7')}>
                  Green
                </Button>
                <Button size="sm" variant="outline" onClick={() => setBackgroundColor('#fef3c7')}>
                  Yellow
                </Button>
                <Button size="sm" variant="outline" onClick={() => setBackgroundColor('#fecaca')}>
                  Red
                </Button>
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <label className="text-sm font-medium mb-2 block">Border Radius</label>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setBorderRadius('0px')}>
                  None
                </Button>
                <Button size="sm" variant="outline" onClick={() => setBorderRadius('4px')}>
                  Small
                </Button>
                <Button size="sm" variant="outline" onClick={() => setBorderRadius('8px')}>
                  Medium
                </Button>
                <Button size="sm" variant="outline" onClick={() => setBorderRadius('16px')}>
                  Large
                </Button>
              </div>
            </div>

            {/* Border */}
            <div>
              <label className="text-sm font-medium mb-2 block">Border</label>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setBorder('none')}>
                  None
                </Button>
                <Button size="sm" variant="outline" onClick={() => setBorder('1px solid #e5e7eb')}>
                  Light
                </Button>
                <Button size="sm" variant="outline" onClick={() => setBorder('2px solid #3b82f6')}>
                  Blue
                </Button>
                <Button size="sm" variant="outline" onClick={() => setBorder('2px dashed #6b7280')}>
                  Dashed
                </Button>
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2 border-t">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setSelectedElement(null)}
                className="w-full"
              >
                Close Editor
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}