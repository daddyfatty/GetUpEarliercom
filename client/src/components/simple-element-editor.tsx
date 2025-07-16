import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SimpleElementEditorProps {
  enabled?: boolean;
}

export function SimpleElementEditor({ enabled = false }: SimpleElementEditorProps) {
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [isEditingText, setIsEditingText] = useState(false);
  const [textValue, setTextValue] = useState('');

  useEffect(() => {
    if (enabled) {
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        
        // Skip toolbar clicks
        if (target.closest('.simple-editor-toolbar')) {
          return;
        }
        
        // Skip buttons and links
        if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
          return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        console.log('SimpleElementEditor: Selected element:', target);
        
        // Clear previous selection
        document.querySelectorAll('.simple-selected').forEach(el => {
          el.classList.remove('simple-selected');
        });
        
        // Add selection class
        target.classList.add('simple-selected');
        
        setSelectedElement(target);
        setTextValue(target.textContent || '');
        setIsEditingText(false);
        
        // Position toolbar
        const rect = target.getBoundingClientRect();
        setToolbarPosition({
          x: Math.min(rect.right + 10, window.innerWidth - 300),
          y: rect.top
        });
      };
      
      document.addEventListener('click', handleClick, true);
      
      return () => {
        document.removeEventListener('click', handleClick, true);
        document.querySelectorAll('.simple-selected').forEach(el => {
          el.classList.remove('simple-selected');
        });
      };
    } else {
      setSelectedElement(null);
      document.querySelectorAll('.simple-selected').forEach(el => {
        el.classList.remove('simple-selected');
      });
    }
  }, [enabled]);

  const applyStyle = (property: string, value: string) => {
    if (selectedElement) {
      console.log(`Applying ${property}: ${value}`);
      selectedElement.style.setProperty(property, value, 'important');
    }
  };

  const saveText = () => {
    if (selectedElement) {
      selectedElement.textContent = textValue;
      setIsEditingText(false);
    }
  };

  if (!enabled || !selectedElement) {
    return null;
  }

  return (
    <div
      className="simple-editor-toolbar fixed z-[9999] bg-white border-2 border-gray-300 rounded-lg shadow-2xl p-4 w-80"
      style={{
        left: toolbarPosition.x,
        top: toolbarPosition.y,
        backgroundColor: 'white',
        zIndex: 9999
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">Edit: {selectedElement.tagName.toLowerCase()}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedElement(null)}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Text Editing */}
      {selectedElement.textContent && (
        <div className="mb-4">
          <h4 className="font-semibold text-sm mb-2">Text Content</h4>
          {isEditingText ? (
            <div className="space-y-2">
              <textarea
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={saveText}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditingText(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setIsEditingText(true)}>
              Edit Text
            </Button>
          )}
        </div>
      )}

      {/* Styling Options */}
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-sm mb-2">Background Color</h4>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={() => applyStyle('background-color', 'white')}>White</Button>
            <Button size="sm" variant="outline" onClick={() => applyStyle('background-color', '#f3f4f6')}>Gray</Button>
            <Button size="sm" variant="outline" onClick={() => applyStyle('background-color', '#dbeafe')}>Blue</Button>
            <Button size="sm" variant="outline" onClick={() => applyStyle('background-color', 'transparent')}>Clear</Button>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">Text Color</h4>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={() => applyStyle('color', '#000000')}>Black</Button>
            <Button size="sm" variant="outline" onClick={() => applyStyle('color', '#3b82f6')}>Blue</Button>
            <Button size="sm" variant="outline" onClick={() => applyStyle('color', '#dc2626')}>Red</Button>
            <Button size="sm" variant="outline" onClick={() => applyStyle('color', '#16a34a')}>Green</Button>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">Font Size</h4>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={() => applyStyle('font-size', '12px')}>12px</Button>
            <Button size="sm" variant="outline" onClick={() => applyStyle('font-size', '16px')}>16px</Button>
            <Button size="sm" variant="outline" onClick={() => applyStyle('font-size', '20px')}>20px</Button>
            <Button size="sm" variant="outline" onClick={() => applyStyle('font-size', '24px')}>24px</Button>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">Font Weight</h4>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={() => applyStyle('font-weight', 'normal')}>Normal</Button>
            <Button size="sm" variant="outline" onClick={() => applyStyle('font-weight', 'bold')}>Bold</Button>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">Padding</h4>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={() => applyStyle('padding', '0px')}>0px</Button>
            <Button size="sm" variant="outline" onClick={() => applyStyle('padding', '10px')}>10px</Button>
            <Button size="sm" variant="outline" onClick={() => applyStyle('padding', '20px')}>20px</Button>
            <Button size="sm" variant="outline" onClick={() => applyStyle('padding', '30px')}>30px</Button>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">Border</h4>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={() => applyStyle('border', '1px solid #ccc')}>Light</Button>
            <Button size="sm" variant="outline" onClick={() => applyStyle('border', '2px solid #3b82f6')}>Blue</Button>
            <Button size="sm" variant="outline" onClick={() => applyStyle('border', 'none')}>None</Button>
          </div>
        </div>
      </div>
    </div>
  );
}