import { pool } from "./db";

export interface WorkoutData {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  caloriesBurned: number;
  equipment: string[] | null;
  exercises: any[];
  imageUrl: string | null;
  videoUrl: string | null;
  authorId: string | null;
  authorName: string | null;
  authorPhoto: string | null;
  createdAt: Date | null;
}

export class WorkoutService {
  async getAllWorkouts(): Promise<WorkoutData[]> {
    try {
      console.log('WorkoutService: Fetching workouts using direct pool connection...');
      const result = await pool.query('SELECT * FROM workouts ORDER BY id');
      
      console.log('WorkoutService: Pool query result:', result.rows.length, 'workouts found');
      
      const workouts = result.rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        difficulty: row.difficulty,
        duration: row.duration,
        caloriesBurned: row.calories_burned,
        equipment: row.equipment || null,
        exercises: row.exercises || [],
        imageUrl: row.image_url || null,
        videoUrl: row.video_url || null,
        authorId: row.author_id || null,
        authorName: row.author_name || null,
        authorPhoto: row.author_photo || null,
        createdAt: row.created_at ? new Date(row.created_at) : null,
      }));
      
      console.log('WorkoutService: Successfully processed workouts:', workouts.length);
      if (workouts.length > 0) {
        console.log('WorkoutService: Sample workout title:', workouts[0].title);
      }
      return workouts;
    } catch (error) {
      console.error('WorkoutService: Database error fetching workouts:', error);
      return [];
    }
  }

  async getWorkoutById(id: number): Promise<WorkoutData | undefined> {
    try {
      console.log('WorkoutService: Fetching workout by ID:', id);
      const result = await pool.query('SELECT * FROM workouts WHERE id = $1', [id]);
      
      console.log('WorkoutService: Query result for ID', id, ':', result.rows.length, 'rows');
      
      if (result.rows.length === 0) {
        console.log('WorkoutService: No workout found with ID:', id);
        return undefined;
      }

      const row = result.rows[0];
      console.log('WorkoutService: Found workout:', row.title);
      
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        difficulty: row.difficulty,
        duration: row.duration,
        caloriesBurned: row.calories_burned,
        equipment: row.equipment || null,
        exercises: row.exercises || [],
        imageUrl: row.image_url || null,
        videoUrl: row.video_url || null,
        authorId: row.author_id || null,
        authorName: row.author_name || null,
        authorPhoto: row.author_photo || null,
        createdAt: row.created_at ? new Date(row.created_at) : null,
      };
    } catch (error) {
      console.error('WorkoutService: Database error fetching workout by ID:', error);
      return undefined;
    }
  }

  async getWorkoutsByCategory(category: string): Promise<WorkoutData[]> {
    try {
      console.log('WorkoutService: Fetching workouts by category:', category);
      const result = await pool.query('SELECT * FROM workouts WHERE category = $1 ORDER BY id', [category]);
      
      const workouts = result.rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        difficulty: row.difficulty,
        duration: row.duration,
        caloriesBurned: row.calories_burned,
        equipment: row.equipment || null,
        exercises: row.exercises || [],
        imageUrl: row.image_url || null,
        videoUrl: row.video_url || null,
        authorId: row.author_id || null,
        authorName: row.author_name || null,
        authorPhoto: row.author_photo || null,
        createdAt: row.created_at ? new Date(row.created_at) : null,
      }));
      
      console.log('WorkoutService: Found', workouts.length, 'workouts in category', category);
      return workouts;
    } catch (error) {
      console.error('WorkoutService: Database error fetching workouts by category:', error);
      return [];
    }
  }
}

export const workoutService = new WorkoutService();