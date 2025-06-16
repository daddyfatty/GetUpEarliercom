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

  async createRecipe(recipeData: any): Promise<RecipeData> {
    try {
      console.log('RecipeService: Creating new recipe:', recipeData.title);
      
      const result = await pool.query(`
        INSERT INTO recipes (
          title, description, category, diet_type, prep_time, servings, serving_size,
          calories, protein, carbs, fat, fiber, sugar, sodium, vitamin_c, vitamin_d,
          calcium, iron, potassium, ingredients, instructions, content, image_url,
          gallery, tags, video_url, author_id, author_name, author_photo, created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
          $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, NOW()
        ) RETURNING *
      `, [
        recipeData.title,
        recipeData.description,
        JSON.stringify(recipeData.category || []),
        JSON.stringify(recipeData.dietType || []),
        recipeData.prepTime,
        recipeData.servings,
        recipeData.servingSize,
        recipeData.calories,
        recipeData.protein,
        recipeData.carbs,
        recipeData.fat,
        recipeData.fiber,
        recipeData.sugar,
        recipeData.sodium,
        recipeData.vitaminC,
        recipeData.vitaminD,
        recipeData.calcium,
        recipeData.iron,
        recipeData.potassium,
        JSON.stringify(recipeData.ingredients || []),
        JSON.stringify(recipeData.instructions || []),
        recipeData.content,
        recipeData.imageUrl,
        JSON.stringify(recipeData.gallery || []),
        JSON.stringify(recipeData.tags || []),
        recipeData.videoUrl,
        recipeData.authorId,
        recipeData.authorName,
        recipeData.authorPhoto
      ]);

      const row = result.rows[0];
      const recipe: RecipeData = {
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

      console.log('RecipeService: Successfully created recipe with ID:', recipe.id);
      return recipe;
    } catch (error) {
      console.error('RecipeService: Database error creating recipe:', error);
      throw error;
    }
  }

  async updateRecipe(id: number, updates: any): Promise<RecipeData | null> {
    try {
      console.log('RecipeService: Updating recipe ID:', id);
      
      const result = await pool.query(`
        UPDATE recipes SET 
          title = COALESCE($2, title),
          description = COALESCE($3, description),
          category = COALESCE($4, category),
          diet_type = COALESCE($5, diet_type),
          prep_time = COALESCE($6, prep_time),
          servings = COALESCE($7, servings),
          serving_size = COALESCE($8, serving_size),
          calories = COALESCE($9, calories),
          protein = COALESCE($10, protein),
          carbs = COALESCE($11, carbs),
          fat = COALESCE($12, fat),
          fiber = COALESCE($13, fiber),
          sugar = COALESCE($14, sugar),
          sodium = COALESCE($15, sodium),
          vitamin_c = COALESCE($16, vitamin_c),
          vitamin_d = COALESCE($17, vitamin_d),
          calcium = COALESCE($18, calcium),
          iron = COALESCE($19, iron),
          potassium = COALESCE($20, potassium),
          ingredients = COALESCE($21, ingredients),
          instructions = COALESCE($22, instructions),
          content = COALESCE($23, content),
          image_url = COALESCE($24, image_url),
          gallery = COALESCE($25, gallery),
          tags = COALESCE($26, tags),
          video_url = COALESCE($27, video_url),
          author_id = COALESCE($28, author_id),
          author_name = COALESCE($29, author_name),
          author_photo = COALESCE($30, author_photo)
        WHERE id = $1
        RETURNING *
      `, [
        id,
        updates.title,
        updates.description,
        updates.category ? JSON.stringify(updates.category) : null,
        updates.dietType ? JSON.stringify(updates.dietType) : null,
        updates.prepTime,
        updates.servings,
        updates.servingSize,
        updates.calories,
        updates.protein,
        updates.carbs,
        updates.fat,
        updates.fiber,
        updates.sugar,
        updates.sodium,
        updates.vitaminC,
        updates.vitaminD,
        updates.calcium,
        updates.iron,
        updates.potassium,
        updates.ingredients ? JSON.stringify(updates.ingredients) : null,
        updates.instructions ? JSON.stringify(updates.instructions) : null,
        updates.content,
        updates.imageUrl,
        updates.gallery ? JSON.stringify(updates.gallery) : null,
        updates.tags ? JSON.stringify(updates.tags) : null,
        updates.videoUrl,
        updates.authorId,
        updates.authorName,
        updates.authorPhoto
      ]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      const recipe: RecipeData = {
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

      console.log('RecipeService: Successfully updated recipe ID:', recipe.id);
      return recipe;
    } catch (error) {
      console.error('RecipeService: Database error updating recipe:', error);
      throw error;
    }
  }

  async deleteRecipe(id: number): Promise<boolean> {
    try {
      console.log('RecipeService: Deleting recipe ID:', id);
      
      const result = await pool.query('DELETE FROM recipes WHERE id = $1', [id]);
      
      const deleted = result.rowCount > 0;
      console.log('RecipeService: Recipe deletion result:', deleted);
      return deleted;
    } catch (error) {
      console.error('RecipeService: Database error deleting recipe:', error);
      throw error;
    }
  }
}

export const recipeService = new RecipeService();