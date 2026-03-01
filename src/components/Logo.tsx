interface LogoProps {
  className?: string
  collapsed?: boolean
}

export const Logo = ({ className, collapsed = false }: LogoProps) => {
  return (
    <div className={`flex items-center justify-center ${className || ''}`}>
      <span className="text-2xl font-black text-gray-900 tracking-tight">
        <span className="text-green-600">prep</span>
        {!collapsed && <span className="text-blue-600">sy :)</span>}
        {collapsed && <span className="text-blue-600">sy</span>}
      </span>
    </div>
  )
}

// Add a default export as well for compatibility
export default Logo
