import { pool } from "./db";

export interface RecipeData {
  id: number;
  title: string;
  description: string;
  category: string[];
  dietType: string[] | null;
  prepTime: number;
  servings: number;
  servingSize: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
  sugar: number | null;
  sodium: number;
  vitaminC: number | null;
  vitaminD: number | null;
  calcium: number | null;
  iron: number | null;
  potassium: number | null;
  ingredients: string[];
  instructions: string[];
  content: string | null;
  imageUrl: string | null;
  gallery: string[] | null;
  tags: string[] | null;
  videoUrl: string | null;
  authorId: string | null;
  authorName: string | null;
  authorPhoto: string | null;
  createdAt: Date | null;
}

export class RecipeService {
  async getAllRecipes(): Promise<RecipeData[]> {
    try {
      console.log('RecipeService: Fetching recipes using direct pool connection...');
      const result = await pool.query('SELECT * FROM recipes ORDER BY id');
      
      console.log('RecipeService: Pool query result:', result.rows.length, 'recipes found');
      
      const recipes = result.rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category || [],
        dietType: row.diet_type || null,
        prepTime: row.prep_time,
        servings: row.servings,
        servingSize: row.serving_size || null,
        calories: row.calories,
        protein: row.protein,
        carbs: row.carbs,
        fat: row.fat,
        fiber: row.fiber || null,
        sugar: row.sugar || null,
        sodium: row.sodium,
        vitaminC: row.vitamin_c || null,
        vitaminD: row.vitamin_d || null,
        calcium: row.calcium || null,
        iron: row.iron || null,
        potassium: row.potassium || null,
        ingredients: row.ingredients || [],
        instructions: row.instructions || [],
        content: row.content || null,
        imageUrl: row.image_url || null,
        gallery: row.gallery || null,
        tags: row.tags || null,
        videoUrl: row.video_url || null,
        authorId: row.author_id || null,
        authorName: row.author_name || null,
        authorPhoto: row.author_photo || null,
        createdAt: row.created_at ? new Date(row.created_at) : null,
      }));
      
      console.log('RecipeService: Successfully processed recipes:', recipes.length);
      if (recipes.length > 0) {
        console.log('RecipeService: Sample recipes:', recipes.slice(0, 3).map(r => r.title));
      }
      return recipes;
    } catch (error) {
      console.error('RecipeService: Database error fetching recipes:', error);
      return [];
    }
  }

  async getRecipeById(id: number): Promise<RecipeData | undefined> {
    try {
      console.log('RecipeService: Fetching recipe by ID:', id);
      const result = await pool.query('SELECT * FROM recipes WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return undefined;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category || [],
        dietType: row.diet_type || null,
        prepTime: row.prep_time,
        servings: row.servings,
        servingSize: row.serving_size || null,
        calories: row.calories,
        protein: row.protein,
        carbs: row.carbs,
        fat: row.fat,
        fiber: row.fiber || null,
        sugar: row.sugar || null,
        sodium: row.sodium,
        vitaminC: row.vitamin_c || null,
        vitaminD: row.vitamin_d || null,
        calcium: row.calcium || null,
        iron: row.iron || null,
        potassium: row.potassium || null,
        ingredients: row.ingredients || [],
        instructions: row.instructions || [],
        content: row.content || null,
        imageUrl: row.image_url || null,
        gallery: row.gallery || null,
        tags: row.tags || null,
        videoUrl: row.video_url || null,
        authorId: row.author_id || null,
        authorName: row.author_name || null,
        authorPhoto: row.author_photo || null,
        createdAt: row.created_at ? new Date(row.created_at) : null,
      };
    } catch (error) {
      console.error('RecipeService: Database error fetching recipe by ID:', error);
      return undefined;
    }
  }

  async searchRecipes(query: string, category?: string, dietType?: string): Promise<RecipeData[]> {
    try {
      console.log('RecipeService: Searching recipes with query:', query, 'category:', category, 'dietType:', dietType);
      
      let sqlQuery = 'SELECT * FROM recipes WHERE 1=1';
      const params: any[] = [];
      
      if (query) {
        params.push(`%${query}%`);
        sqlQuery += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length})`;
      }
      
      if (category && category !== 'all') {
        params.push(`%${category}%`);
        sqlQuery += ` AND category::text ILIKE $${params.length}`;
      }
      
      if (dietType && dietType !== 'all') {
        params.push(`%${dietType}%`);
        sqlQuery += ` AND diet_type::text ILIKE $${params.length}`;
      }
      
      sqlQuery += ' ORDER BY id';
      
      const result = await pool.query(sqlQuery, params);
      
      const recipes = result.rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category || [],
        dietType: row.diet_type || null,
        prepTime: row.prep_time,
        servings: row.servings,
        servingSize: row.serving_size || null,
        calories: row.calories,
        protein: row.protein,
        carbs: row.carbs,
        fat: row.fat,
        fiber: row.fiber || null,
        sugar: row.sugar || null,
        sodium: row.sodium,
        vitaminC: row.vitamin_c || null,
        vitaminD: row.vitamin_d || null,
        calcium: row.calcium || null,
        iron: row.iron || null,
        potassium: row.potassium || null,
        ingredients: row.ingredients || [],
        instructions: row.instructions || [],
        content: row.content || null,
        imageUrl: row.image_url || null,
        gallery: row.gallery || null,
        tags: row.tags || null,
        videoUrl: row.video_url || null,
        authorId: row.author_id || null,
        authorName: row.author_name || null,
        authorPhoto: row.author_photo || null,
        createdAt: row.created_at ? new Date(row.created_at) : null,
      }));
      
      console.log('RecipeService: Found', recipes.length, 'recipes matching search criteria');
      return recipes;
    } catch (error) {
      console.error('RecipeService: Database error searching recipes:', error);
      return [];
    }
  }
}

export const recipeService = new RecipeService();