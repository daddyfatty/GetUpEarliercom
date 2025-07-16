import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit3, Eye, Palette, Move, Square, X } from "lucide-react";

interface ElementEditorProps {
  enabled?: boolean;
}

export function ElementEditor({ enabled = false }: ElementEditorProps) {
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Only enable when explicitly requested
    if (enabled) {
      document.body.classList.add('element-editor-mode');
      
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        
        // Don't interfere with editor toolbar clicks or buttons
        if (target.closest('.element-editor-toolbar') || 
            target.closest('button') || 
            target.closest('[role="button"]')) {
          return;
        }
        
        // Only target div elements
        if (target.tagName.toLowerCase() === 'div') {
          e.preventDefault();
          e.stopPropagation();
          
          // Add a small delay to prevent flickering
          setTimeout(() => {
            setSelectedElement(target);
            setEditorPosition({ 
              x: Math.min(e.clientX, window.innerWidth - 320), 
              y: Math.max(e.clientY - 200, 10) 
            });
          }, 50);
        }
      };
      
      document.addEventListener('click', handleClick, true);
      
      return () => {
        document.removeEventListener('click', handleClick, true);
        document.body.classList.remove('element-editor-mode');
      };
    } else {
      document.body.classList.remove('element-editor-mode');
      setSelectedElement(null);
    }
  }, [enabled]);

  const updateElementStyle = (property: string, value: string) => {
    if (selectedElement) {
      selectedElement.style.setProperty(property, value, 'important');
      // Force a repaint to ensure the style sticks
      selectedElement.offsetHeight;
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

  // Show the editing toolbar when an element is selected
  if (selectedElement) {
    return (
      <div
        className="element-editor-toolbar fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl p-4 min-w-[300px]"
        style={{
          left: editorPosition.x,
          top: editorPosition.y,
          pointerEvents: 'auto',
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-xs">
            <Edit3 className="h-3 w-3 mr-1" />
            Editing: {selectedElement.tagName.toLowerCase()}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedElement(null)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-3">
          {/* Padding Controls */}
          <div>
            <label className="text-sm font-medium mb-2 block">Padding</label>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => addPadding('10px')}>
                10px
              </Button>
              <Button size="sm" variant="outline" onClick={() => addPadding('20px')}>
                20px
              </Button>
              <Button size="sm" variant="outline" onClick={() => addPadding('30px')}>
                30px
              </Button>
              <Button size="sm" variant="outline" onClick={() => addPadding('0px')}>
                None
              </Button>
            </div>
          </div>

          {/* Margin Controls */}
          <div>
            <label className="text-sm font-medium mb-2 block">Margin</label>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => addMargin('10px')}>
                10px
              </Button>
              <Button size="sm" variant="outline" onClick={() => addMargin('20px')}>
                20px
              </Button>
              <Button size="sm" variant="outline" onClick={() => addMargin('30px')}>
                30px
              </Button>
              <Button size="sm" variant="outline" onClick={() => addMargin('0px')}>
                None
              </Button>
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="text-sm font-medium mb-2 block">Background</label>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setBackgroundColor('white')}>
                White
              </Button>
              <Button size="sm" variant="outline" onClick={() => setBackgroundColor('#f3f4f6')}>
                Gray
              </Button>
              <Button size="sm" variant="outline" onClick={() => setBackgroundColor('#dbeafe')}>
                Blue
              </Button>
              <Button size="sm" variant="outline" onClick={() => setBackgroundColor('transparent')}>
                None
              </Button>
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <label className="text-sm font-medium mb-2 block">Border Radius</label>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setBorderRadius('4px')}>
                4px
              </Button>
              <Button size="sm" variant="outline" onClick={() => setBorderRadius('8px')}>
                8px
              </Button>
              <Button size="sm" variant="outline" onClick={() => setBorderRadius('12px')}>
                12px
              </Button>
              <Button size="sm" variant="outline" onClick={() => setBorderRadius('0px')}>
                None
              </Button>
            </div>
          </div>

          {/* Border */}
          <div>
            <label className="text-sm font-medium mb-2 block">Border</label>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setBorder('1px solid #e5e7eb')}>
                Light
              </Button>
              <Button size="sm" variant="outline" onClick={() => setBorder('2px solid #3b82f6')}>
                Blue
              </Button>
              <Button size="sm" variant="outline" onClick={() => setBorder('none')}>
                None
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}