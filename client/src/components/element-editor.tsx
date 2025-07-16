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
  const [isEditingText, setIsEditingText] = useState(false);
  const [originalText, setOriginalText] = useState('');

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
        
        // Find the closest editable element (any element that can be styled)
        let targetElement = target;
        
        // If it's a text node, get its parent element
        if (target.nodeType === Node.TEXT_NODE) {
          targetElement = target.parentElement as HTMLElement;
        }
        
        // Skip if it's a script, style, or other non-visual element
        const skipElements = ['script', 'style', 'meta', 'link', 'head', 'title'];
        if (skipElements.includes(targetElement.tagName.toLowerCase())) {
          return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Selected element:', targetElement);
        setSelectedElement(targetElement);
        setEditorPosition({ 
          x: Math.min(e.clientX, window.innerWidth - 320), 
          y: Math.max(e.clientY - 200, 10) 
        });
        
        // Store original text for editing
        setOriginalText(targetElement.textContent || '');
        setIsEditingText(false);
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
      console.log(`Applying ${property}: ${value} to element:`, selectedElement);
      selectedElement.style.setProperty(property, value, 'important');
      // Force a repaint to ensure the style sticks
      selectedElement.offsetHeight;
      
      // Also update any existing inline styles
      if (selectedElement.hasAttribute('style')) {
        const currentStyle = selectedElement.getAttribute('style') || '';
        if (!currentStyle.includes(property)) {
          selectedElement.setAttribute('style', currentStyle + `; ${property}: ${value} !important`);
        }
      }
    }
  };

  const addPadding = (amount: string) => {
    console.log('Adding padding:', amount);
    updateElementStyle('padding', amount);
  };

  const addMargin = (amount: string) => {
    console.log('Adding margin:', amount);
    updateElementStyle('margin', amount);
  };

  const setBackgroundColor = (color: string) => {
    console.log('Setting background color:', color);
    updateElementStyle('background-color', color);
  };

  const setBorderRadius = (radius: string) => {
    console.log('Setting border radius:', radius);
    updateElementStyle('border-radius', radius);
  };

  const setBorder = (border: string) => {
    console.log('Setting border:', border);
    updateElementStyle('border', border);
  };

  const setTextColor = (color: string) => {
    console.log('Setting text color:', color);
    updateElementStyle('color', color);
  };

  const setFontSize = (size: string) => {
    console.log('Setting font size:', size);
    updateElementStyle('font-size', size);
  };

  const setFontWeight = (weight: string) => {
    console.log('Setting font weight:', weight);
    updateElementStyle('font-weight', weight);
  };

  const startTextEdit = () => {
    if (selectedElement) {
      setIsEditingText(true);
      setOriginalText(selectedElement.textContent || '');
    }
  };

  const saveTextEdit = (newText: string) => {
    if (selectedElement) {
      selectedElement.textContent = newText;
      setIsEditingText(false);
    }
  };

  const cancelTextEdit = () => {
    if (selectedElement) {
      selectedElement.textContent = originalText;
      setIsEditingText(false);
    }
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
          {/* Text Editing */}
          {selectedElement && selectedElement.textContent && (
            <div>
              <label className="text-sm font-medium mb-2 block">Text Content</label>
              {isEditingText ? (
                <div className="space-y-2">
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    value={selectedElement.textContent}
                    onChange={(e) => {
                      selectedElement.textContent = e.target.value;
                    }}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setIsEditingText(false)}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelTextEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button size="sm" variant="outline" onClick={startTextEdit}>
                  Edit Text
                </Button>
              )}
            </div>
          )}

          {/* Font Controls */}
          <div>
            <label className="text-sm font-medium mb-2 block">Font Size</label>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setFontSize('12px')}>
                12px
              </Button>
              <Button size="sm" variant="outline" onClick={() => setFontSize('16px')}>
                16px
              </Button>
              <Button size="sm" variant="outline" onClick={() => setFontSize('18px')}>
                18px
              </Button>
              <Button size="sm" variant="outline" onClick={() => setFontSize('24px')}>
                24px
              </Button>
            </div>
          </div>

          {/* Font Weight */}
          <div>
            <label className="text-sm font-medium mb-2 block">Font Weight</label>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setFontWeight('normal')}>
                Normal
              </Button>
              <Button size="sm" variant="outline" onClick={() => setFontWeight('bold')}>
                Bold
              </Button>
              <Button size="sm" variant="outline" onClick={() => setFontWeight('600')}>
                Semi-Bold
              </Button>
            </div>
          </div>

          {/* Text Color */}
          <div>
            <label className="text-sm font-medium mb-2 block">Text Color</label>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setTextColor('#000000')}>
                Black
              </Button>
              <Button size="sm" variant="outline" onClick={() => setTextColor('#3b82f6')}>
                Blue
              </Button>
              <Button size="sm" variant="outline" onClick={() => setTextColor('#dc2626')}>
                Red
              </Button>
              <Button size="sm" variant="outline" onClick={() => setTextColor('#16a34a')}>
                Green
              </Button>
            </div>
          </div>

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