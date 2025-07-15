import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Calendar, Clock, MapPin, TrendingUp } from "lucide-react";

export default function TrainingLogAdmin() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    content: '',
    distance: '',
    pace: '',
    time: '',
    images: [] as string[]
  });
  const [imageInput, setImageInput] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTrainingLogMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/training-log', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Training log entry created successfully!"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        title: '',
        content: '',
        distance: '',
        pace: '',
        time: '',
        images: []
      });
      setImageInput('');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create training log entry",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const slug = formData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    const nextEntryNumber = await getNextEntryNumber();
    
    const trainingLogData = {
      ...formData,
      slug,
      entryNumber: nextEntryNumber,
      categories: ["Marathon Training Log", "Marathon Training", "Running"],
      images: formData.images.length > 0 ? formData.images : undefined
    };
    
    createTrainingLogMutation.mutate(trainingLogData);
  };

  const getNextEntryNumber = async () => {
    try {
      const response = await fetch('/api/training-log');
      const entries = await response.json();
      return entries.length > 0 ? Math.max(...entries.map((e: any) => e.entryNumber)) + 1 : 1;
    } catch {
      return 1;
    }
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Add Training Log Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Training Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title">Training Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., 19-Mile Hartford Marathon Training Run"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="distance" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Distance
                  </Label>
                  <Input
                    id="distance"
                    value={formData.distance}
                    onChange={(e) => setFormData(prev => ({ ...prev, distance: e.target.value }))}
                    placeholder="e.g., 19.00 miles"
                  />
                </div>
                <div>
                  <Label htmlFor="pace">Pace</Label>
                  <Input
                    id="pace"
                    value={formData.pace}
                    onChange={(e) => setFormData(prev => ({ ...prev, pace: e.target.value }))}
                    placeholder="e.g., 8:22/mile"
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time
                  </Label>
                  <Input
                    id="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    placeholder="e.g., 2h 38m"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="content">Training Summary</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Describe your training session, how you felt, key takeaways..."
                  rows={8}
                  required
                />
              </div>

              <div>
                <Label>Training Photos</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="Enter image path (e.g., /attached_assets/image.jpg)"
                  />
                  <Button type="button" onClick={addImage} variant="outline">
                    Add Image
                  </Button>
                </div>
                {formData.images.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="flex-1 text-sm">{image}</span>
                        <Button
                          type="button"
                          onClick={() => removeImage(index)}
                          variant="ghost"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={createTrainingLogMutation.isPending}
                className="w-full"
              >
                {createTrainingLogMutation.isPending ? "Creating..." : "Create Training Log Entry"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}