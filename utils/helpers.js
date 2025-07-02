/**
 * Helper function to get the correct image URL
 * @param {string} imageUrl - The image URL to process
 * @returns {string|null} - The processed image URL or null if no image
 */
export function getImageUrl(imageUrl) {
  if (!imageUrl) return null;

  // Already a blob URL (for new file previews), return as is
  if (imageUrl.startsWith('blob:')) {
    return imageUrl;
  }

  // Relative path, ensure it starts with /
  if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
    return `/${imageUrl}`;
  }

  // Already starts with /, return as is
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }

  // Return as is (for absolute URLs)
  return imageUrl;
}

/**
 * Validates if a file is a valid image type
 * @param {File} file - The file to validate
 * @returns {boolean} - Whether the file is a valid image
 */
export function isValidImageFile(file) {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
}

/**
 * Formats a date to a readable string
 * @param {string|Date} date - The date to format
 * @returns {string} - The formatted date string
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

/**
 * Scrolls to the top of the page smoothly
 */
export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
