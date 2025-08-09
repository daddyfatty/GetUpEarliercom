
-- Update the title of the marathon training blog post
-- This script updates the title from "Marathon Training Tip for HOT long runs" 
-- to "Marathon Training Tip for HOT long runs: Soft Flask"

UPDATE blog_posts 
SET title = 'Marathon Training Tip for HOT long runs: Soft Flask'
WHERE title = 'Marathon Training Tip for HOT long runs';

-- Alternative update in case the post is stored with a different identifier
UPDATE blog_posts 
SET title = 'Marathon Training Tip for HOT long runs: Soft Flask'
WHERE id = 'marathon-training-tip-hot-long-runs-frozen-electrolyte-bottle' 
   OR slug = 'marathon-training-tip-hot-long-runs-frozen-electrolyte-bottle';

-- Verify the update
SELECT id, slug, title FROM blog_posts 
WHERE title LIKE '%Marathon Training Tip for HOT long runs%' 
   OR slug = 'marathon-training-tip-hot-long-runs-frozen-electrolyte-bottle';
