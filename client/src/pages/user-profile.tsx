import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Calendar, Target, Heart, Activity, Utensils } from "lucide-react";

export default function UserProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    bio: "",
    fitnessGoals: "",
    dietaryPreferences: "",
  });

  const handleSave = () => {
    // TODO: Implement save functionality with API
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data
    setProfileData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: "",
      bio: "",
      fitnessGoals: "",
      dietaryPreferences: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="w-24 h-24 bg-[hsl(var(--navy))] rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-12 w-12 text-white" />
            </div>
            <CardTitle className="text-2xl">
              {user?.firstName || user?.email || "User"} Profile
            </CardTitle>
            <CardDescription>
              Manage your personal information and preferences
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="fitness">Fitness Goals</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  ) : (
                    <div className="space-x-2">
                      <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                      <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself and your health journey..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fitness Goals */}
          <TabsContent value="fitness">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Fitness Goals</span>
                </CardTitle>
                <CardDescription>Set and track your fitness objectives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="fitnessGoals">Current Fitness Goals</Label>
                  <Textarea
                    id="fitnessGoals"
                    value={profileData.fitnessGoals}
                    onChange={(e) => setProfileData({ ...profileData, fitnessGoals: e.target.value })}
                    disabled={!isEditing}
                    placeholder="e.g., Run a 5K, Build muscle, Improve flexibility..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="text-center pb-2">
                      <Activity className="h-8 w-8 text-blue-600 mx-auto" />
                      <CardTitle className="text-lg">Weekly Workouts</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-2xl font-bold text-blue-600">0</div>
                      <p className="text-sm text-gray-600">This week</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="text-center pb-2">
                      <Target className="h-8 w-8 text-green-600 mx-auto" />
                      <CardTitle className="text-lg">Goals Met</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-2xl font-bold text-green-600">0</div>
                      <p className="text-sm text-gray-600">This month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="text-center pb-2">
                      <Calendar className="h-8 w-8 text-purple-600 mx-auto" />
                      <CardTitle className="text-lg">Streak</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-2xl font-bold text-purple-600">0</div>
                      <p className="text-sm text-gray-600">Days</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nutrition */}
          <TabsContent value="nutrition">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Utensils className="h-5 w-5" />
                  <span>Nutrition Preferences</span>
                </CardTitle>
                <CardDescription>Manage your dietary preferences and restrictions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="dietaryPreferences">Dietary Preferences & Restrictions</Label>
                  <Textarea
                    id="dietaryPreferences"
                    value={profileData.dietaryPreferences}
                    onChange={(e) => setProfileData({ ...profileData, dietaryPreferences: e.target.value })}
                    disabled={!isEditing}
                    placeholder="e.g., Vegetarian, Gluten-free, Dairy-free, Allergies..."
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Quick Preferences</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Vegetarian</Badge>
                    <Badge variant="outline">Vegan</Badge>
                    <Badge variant="outline">Keto</Badge>
                    <Badge variant="outline">Paleo</Badge>
                    <Badge variant="outline">Gluten-Free</Badge>
                    <Badge variant="outline">Dairy-Free</Badge>
                    <Badge variant="outline">Low-Carb</Badge>
                    <Badge variant="outline">High-Protein</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements */}
          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Achievements</span>
                </CardTitle>
                <CardDescription>Track your health and fitness milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Achievements Yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start your fitness journey to unlock achievements and track your progress.
                  </p>
                  <Button>View Available Achievements</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}