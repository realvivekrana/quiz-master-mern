// ==========================================
// Admin Authorization Middleware
// ==========================================

export default function admin(req, res, next) {
  // protect middleware pehle req.user set karega
  if (!req.user) {
    return res.status(401).json({
      message: 'Authentication required'
    })
  }

  // Check admin role
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Admin access required'
    })
  }

  next()
}