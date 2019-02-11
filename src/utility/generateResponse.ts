export default (content, success) => {
  if (success)
    return {
      data: content,
    };
  else 
    return {
      error: content
    }
}