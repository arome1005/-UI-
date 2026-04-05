"use client"

import { useState, useEffect, useRef } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface CharacterProps {
  mousePosition: { x: number; y: number }
  containerRef: React.RefObject<HTMLDivElement | null>
  isPasswordFocused: boolean
  isEmailFocused: boolean
  emailValue: string
}

// 计算眼睛跟随鼠标的偏移
function calculateEyeOffset(
  mouseX: number,
  mouseY: number,
  elementX: number,
  elementY: number,
  maxOffset: number = 4
) {
  const deltaX = mouseX - elementX
  const deltaY = mouseY - elementY
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  
  if (distance === 0) return { x: 0, y: 0 }
  
  const normalizedX = (deltaX / distance) * Math.min(distance / 50, 1) * maxOffset
  const normalizedY = (deltaY / distance) * Math.min(distance / 50, 1) * maxOffset
  
  return { x: normalizedX, y: normalizedY }
}

// 蓝色/紫色长方形角色 - 主角，会伸脖子偷看
function BlueCharacter({ mousePosition, containerRef, isPasswordFocused, isEmailFocused, emailValue }: CharacterProps) {
  const characterRef = useRef<HTMLDivElement>(null)
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    if (!characterRef.current || !containerRef.current) return
    const rect = characterRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2 - containerRect.left
    const centerY = rect.top + rect.height / 3 - containerRect.top
    
    const offset = calculateEyeOffset(mousePosition.x, mousePosition.y, centerX, centerY, 5)
    setEyeOffset(offset)
  }, [mousePosition, containerRef])

  // 计算脖子伸长的程度（基于邮箱输入长度）
  const neckStretch = isEmailFocused ? Math.min(emailValue.length * 4, 80) : 0
  
  return (
    <div 
      ref={characterRef}
      className="absolute transition-all duration-500 ease-out"
      style={{
        left: '80px',
        bottom: '60px',
        zIndex: 30,
      }}
    >
      {/* 脖子部分 - 输入邮箱时伸出 */}
      <div 
        className="absolute bg-[#5B5BD6] transition-all duration-300 ease-out"
        style={{
          width: '70px',
          height: `${neckStretch}px`,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderRadius: '8px 8px 0 0',
          opacity: neckStretch > 0 ? 1 : 0,
        }}
      />
      
      {/* 偷看的头部 - 输入邮箱时出现在脖子顶端 */}
      {isEmailFocused && neckStretch > 20 && (
        <div 
          className="absolute bg-[#5B5BD6] transition-all duration-300"
          style={{
            width: '80px',
            height: '45px',
            bottom: `calc(100% + ${neckStretch - 10}px)`,
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: '12px',
          }}
        >
          {/* 偷看时的眼睛 */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-4">
            <div className="relative h-4 w-4 rounded-full bg-white">
              <div 
                className="absolute h-2 w-2 rounded-full bg-[#1a1a2e]"
                style={{
                  left: `calc(50% + ${eyeOffset.x}px - 4px)`,
                  top: `calc(50% + ${eyeOffset.y}px - 4px)`,
                }}
              />
            </div>
            <div className="relative h-4 w-4 rounded-full bg-white">
              <div 
                className="absolute h-2 w-2 rounded-full bg-[#1a1a2e]"
                style={{
                  left: `calc(50% + ${eyeOffset.x}px - 4px)`,
                  top: `calc(50% + ${eyeOffset.y}px - 4px)`,
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* 主体 */}
      <div 
        className={cn(
          "relative w-[100px] h-[160px] bg-[#5B5BD6] rounded-[14px] transition-transform duration-500",
          isPasswordFocused && "scale-x-[-1]" // 输入密码时背过身
        )}
      >
        {/* 眼睛 - 输入密码时隐藏（因为背过身了） */}
        {!isPasswordFocused && !isEmailFocused && (
          <div className="absolute top-7 left-1/2 -translate-x-1/2 flex gap-4">
            <div className="relative h-5 w-5 rounded-full bg-white">
              <div 
                className="absolute h-2.5 w-2.5 rounded-full bg-[#1a1a2e] transition-all duration-100"
                style={{
                  left: `calc(50% + ${eyeOffset.x}px - 5px)`,
                  top: `calc(50% + ${eyeOffset.y}px - 5px)`,
                }}
              />
            </div>
            <div className="relative h-5 w-5 rounded-full bg-white">
              <div 
                className="absolute h-2.5 w-2.5 rounded-full bg-[#1a1a2e] transition-all duration-100"
                style={{
                  left: `calc(50% + ${eyeOffset.x}px - 5px)`,
                  top: `calc(50% + ${eyeOffset.y}px - 5px)`,
                }}
              />
            </div>
          </div>
        )}
        
        {/* 背面的头发/纹理 - 输入密码时显示 */}
        {isPasswordFocused && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col gap-2">
            <div className="w-14 h-1 bg-[#4a4ac4] rounded-full" />
            <div className="w-10 h-1 bg-[#4a4ac4] rounded-full ml-2" />
            <div className="w-12 h-1 bg-[#4a4ac4] rounded-full ml-1" />
          </div>
        )}
      </div>
    </div>
  )
}

// 橙色半圆角色
function OrangeCharacter({ mousePosition, containerRef, isPasswordFocused }: CharacterProps) {
  const characterRef = useRef<HTMLDivElement>(null)
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    if (!characterRef.current || !containerRef.current) return
    const rect = characterRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2 - containerRect.left
    const centerY = rect.top + rect.height / 3 - containerRect.top
    
    const offset = calculateEyeOffset(mousePosition.x, mousePosition.y, centerX, centerY, 4)
    setEyeOffset(offset)
  }, [mousePosition, containerRef])

  return (
    <div 
      ref={characterRef}
      className="absolute"
      style={{
        left: '20px',
        bottom: '0px',
        zIndex: 20,
      }}
    >
      <div 
        className={cn(
          "relative w-[140px] h-[100px] bg-[#E07850] transition-transform duration-500",
          isPasswordFocused && "scale-x-[-1]"
        )}
        style={{
          borderRadius: '70px 70px 0 0',
        }}
      >
        {/* 眼睛 */}
        {!isPasswordFocused && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-6">
            <div className="relative h-3.5 w-3.5 rounded-full bg-[#1a1a2e]">
              <div 
                className="absolute h-1.5 w-1.5 rounded-full bg-white transition-all duration-100"
                style={{
                  left: `calc(30% + ${eyeOffset.x * 0.3}px)`,
                  top: `calc(20% + ${eyeOffset.y * 0.3}px)`,
                }}
              />
            </div>
            <div className="relative h-3.5 w-3.5 rounded-full bg-[#1a1a2e]">
              <div 
                className="absolute h-1.5 w-1.5 rounded-full bg-white transition-all duration-100"
                style={{
                  left: `calc(30% + ${eyeOffset.x * 0.3}px)`,
                  top: `calc(20% + ${eyeOffset.y * 0.3}px)`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 黑色长方形角色
function BlackCharacter({ mousePosition, containerRef, isPasswordFocused }: CharacterProps) {
  const characterRef = useRef<HTMLDivElement>(null)
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    if (!characterRef.current || !containerRef.current) return
    const rect = characterRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2 - containerRect.left
    const centerY = rect.top + rect.height / 3 - containerRect.top
    
    const offset = calculateEyeOffset(mousePosition.x, mousePosition.y, centerX, centerY, 3)
    setEyeOffset(offset)
  }, [mousePosition, containerRef])

  return (
    <div 
      ref={characterRef}
      className="absolute"
      style={{
        left: '170px',
        bottom: '30px',
        zIndex: 25,
      }}
    >
      <div 
        className={cn(
          "relative w-[55px] h-[90px] bg-[#1a1a2e] rounded-[10px] transition-transform duration-500",
          isPasswordFocused && "scale-x-[-1]"
        )}
      >
        {/* 眼睛 */}
        {!isPasswordFocused && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-2.5">
            <div className="relative h-3 w-3 rounded-full bg-white">
              <div 
                className="absolute h-1.5 w-1.5 rounded-full bg-[#1a1a2e] transition-all duration-100"
                style={{
                  left: `calc(50% + ${eyeOffset.x}px - 3px)`,
                  top: `calc(50% + ${eyeOffset.y}px - 3px)`,
                }}
              />
            </div>
            <div className="relative h-3 w-3 rounded-full bg-white">
              <div 
                className="absolute h-1.5 w-1.5 rounded-full bg-[#1a1a2e] transition-all duration-100"
                style={{
                  left: `calc(50% + ${eyeOffset.x}px - 3px)`,
                  top: `calc(50% + ${eyeOffset.y}px - 3px)`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 黄色圆角矩形角色
function YellowCharacter({ mousePosition, containerRef, isPasswordFocused }: CharacterProps) {
  const characterRef = useRef<HTMLDivElement>(null)
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    if (!characterRef.current || !containerRef.current) return
    const rect = characterRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2 - containerRect.left
    const centerY = rect.top + rect.height / 3 - containerRect.top
    
    const offset = calculateEyeOffset(mousePosition.x, mousePosition.y, centerX, centerY, 3)
    setEyeOffset(offset)
  }, [mousePosition, containerRef])

  return (
    <div 
      ref={characterRef}
      className="absolute"
      style={{
        left: '240px',
        bottom: '20px',
        zIndex: 15,
      }}
    >
      <div 
        className={cn(
          "relative w-[70px] h-[85px] bg-[#D4A853] transition-transform duration-500",
          isPasswordFocused && "scale-x-[-1]"
        )}
        style={{
          borderRadius: '35px 35px 35px 35px',
        }}
      >
        {/* 眼睛 */}
        {!isPasswordFocused && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-3">
            <div className="relative h-2.5 w-2.5 rounded-full bg-[#1a1a2e]">
              <div 
                className="absolute h-1 w-1 rounded-full bg-white transition-all duration-100"
                style={{
                  left: `calc(30% + ${eyeOffset.x * 0.2}px)`,
                  top: `calc(20% + ${eyeOffset.y * 0.2}px)`,
                }}
              />
            </div>
            <div className="relative h-2.5 w-2.5 rounded-full bg-[#1a1a2e]">
              <div 
                className="absolute h-1 w-1 rounded-full bg-white transition-all duration-100"
                style={{
                  left: `calc(30% + ${eyeOffset.x * 0.2}px)`,
                  top: `calc(20% + ${eyeOffset.y * 0.2}px)`,
                }}
              />
            </div>
          </div>
        )}
        
        {/* 嘴巴 - 一条横线 */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#1a1a2e] rounded-full" />
      </div>
    </div>
  )
}

// Google 图标
function GoogleIcon() {
  return (
    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

interface LoginPageProps {
  onLoginSuccess?: () => void
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // 监听鼠标移动
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const characterProps: CharacterProps = {
    mousePosition,
    containerRef,
    isPasswordFocused,
    isEmailFocused,
    emailValue: email,
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* 左侧 - 角色展示区 */}
      <div 
        ref={containerRef}
        className="relative hidden w-1/2 bg-[#2D3142] md:flex md:flex-col md:justify-between overflow-hidden"
      >
        {/* Logo */}
        <div className="p-8">
          <h1 className="text-2xl font-bold text-white">墨境</h1>
          <p className="text-sm text-gray-400">AI 辅助创作平台</p>
        </div>

        {/* 角色们 */}
        <div className="relative h-[300px] w-full">
          <OrangeCharacter {...characterProps} />
          <BlueCharacter {...characterProps} />
          <BlackCharacter {...characterProps} />
          <YellowCharacter {...characterProps} />
        </div>
      </div>

      {/* 右侧 - 登录表单 */}
      <div className="flex w-full flex-col items-center justify-center bg-[#FAFAFA] p-8 md:w-1/2">
        <div className="w-full max-w-[400px] space-y-8">
          {/* 标题 */}
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
              Welcome back!
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Please enter your details
            </p>
          </div>

          {/* 表单 */}
          <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault()
            if (email && password) {
              onLoginSuccess?.()
            }
          }}>
            {/* 邮箱 */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                className="w-full border-0 border-b-2 border-gray-200 bg-transparent py-3 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors"
              />
            </div>

            {/* 密码 */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className="w-full border-0 border-b-2 border-gray-200 bg-transparent py-3 pr-10 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* 记住我 & 忘记密码 */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Remember for 30 days
                </label>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </button>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              className="w-full rounded-full border border-gray-300 bg-white py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
            >
              Log in
            </button>

            {/* 分割线 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#FAFAFA] px-4 text-gray-500">or</span>
              </div>
            </div>

            {/* Google 登录 */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
            >
              <GoogleIcon />
              Log in with Google
            </button>
          </form>

          {/* 注册链接 */}
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <button className="font-semibold text-gray-900 hover:underline">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
