import { BlogPost } from '@shared/schema';

interface YouTubeValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  checklist: {
    title: boolean;
    description: boolean;
    thumbnail: boolean;
    links: boolean;
    timestamps: boolean;
    formatting: boolean;
  };
}

export function validateYouTubePost(post: any, originalVideoData: any): YouTubeValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Title validation
  const titleValid = post.title === originalVideoData.title;
  if (!titleValid) {
    errors.push(`Title mismatch: Expected "${originalVideoData.title}", got "${post.title}"`);
  }
  
  // Description validation
  const descriptionValid = post.content && post.content.length > 50;
  if (!descriptionValid) {
    errors.push(`Description too short or missing: ${post.content?.length || 0} characters`);
  }
  
  // Check for synthetic content indicators
  if (post.content && (
    post.content.includes('This video discusses:') ||
    post.content.includes('For the full content and details') ||
    post.content === post.title
  )) {
    errors.push('Content appears to be synthetic, not authentic YouTube description');
  }
  
  // Thumbnail validation
  const thumbnailValid = post.imageUrl && post.imageUrl.includes('i.ytimg.com');
  if (!thumbnailValid) {
    errors.push(`Invalid thumbnail URL: ${post.imageUrl}`);
  }
  
  // Links validation
  const hasLinks = post.content && post.content.includes('<a href=');
  const linksValid = hasLinks || post.content?.includes('http');
  if (!linksValid && originalVideoData.description?.includes('http')) {
    warnings.push('Original description had links but none found in processed content');
  }
  
  // Timestamps validation
  const hasTimestamps = post.content && post.content.includes('&t=');
  const timestampsValid = hasTimestamps || !originalVideoData.description?.includes(':');
  if (!timestampsValid) {
    warnings.push('Original description had timestamps but none converted to clickable links');
  }
  
  // Formatting validation
  const hasProperFormatting = post.content && (
    post.content.includes('<br>') || 
    post.content.includes('<span style="color: #1d9bf0;">') ||
    post.content.includes('target="_blank"')
  );
  
  const result: YouTubeValidationResult = {
    valid: errors.length === 0,
    errors,
    warnings,
    checklist: {
      title: titleValid,
      description: descriptionValid,
      thumbnail: thumbnailValid,
      links: linksValid,
      timestamps: timestampsValid,
      formatting: hasProperFormatting
    }
  };
  
  return result;
}

export function logValidationResult(result: YouTubeValidationResult, videoId: string): void {
  console.log(`\n=== YouTube Blog Post Validation: ${videoId} ===`);
  console.log(`Status: ${result.valid ? 'VALID ✅' : 'INVALID ❌'}`);
  
  console.log('\n📋 Checklist:');
  console.log(`  Title: ${result.checklist.title ? '✅' : '❌'}`);
  console.log(`  Description: ${result.checklist.description ? '✅' : '❌'}`);
  console.log(`  Thumbnail: ${result.checklist.thumbnail ? '✅' : '❌'}`);
  console.log(`  Links: ${result.checklist.links ? '✅' : '❌'}`);
  console.log(`  Timestamps: ${result.checklist.timestamps ? '✅' : '❌'}`);
  console.log(`  Formatting: ${result.checklist.formatting ? '✅' : '❌'}`);
  
  if (result.errors.length > 0) {
    console.log('\n❌ Errors:');
    result.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (result.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    result.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  console.log('==========================================\n');
}