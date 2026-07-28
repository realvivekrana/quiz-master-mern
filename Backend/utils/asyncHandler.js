// Wraps an async route handler so any thrown error / rejected promise
// is forwarded to Express's error-handling middleware instead of crashing.
export default function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}