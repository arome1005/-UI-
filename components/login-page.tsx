"use client"

import { useState, useEffect, useRef } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  const neckStretch = isEmailFocused ? Math.min(emailValue.length * 3, 60) : 0
  
  return (
    <div 
      ref={characterRef}
      className="absolute transition-all duration-500 ease-out"
      style={{
        left: '15%',
        bottom: '15%',
        zIndex: 30,
      }}
    >
      {/* 脖子部分 - 输入邮箱时伸出 */}
      <div 
        className="absolute bg-[#5B5BD6] transition-all duration-300 ease-out"
        style={{
          width: '80px',
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
            width: '90px',
            height: '50px',
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
          "relative w-[120px] h-[180px] bg-[#5B5BD6] rounded-[16px] transition-transform duration-500",
          isPasswordFocused && "scale-x-[-1]" // 输入密码时背过身
        )}
      >
        {/* 眼睛 - 输入密码时隐藏（因为背过身了） */}
        {!isPasswordFocused && !isEmailFocused && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-5">
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
            <div className="w-16 h-1 bg-[#4a4ac4] rounded-full" />
            <div className="w-12 h-1 bg-[#4a4ac4] rounded-full ml-2" />
            <div className="w-14 h-1 bg-[#4a4ac4] rounded-full ml-1" />
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
        left: '5%',
        bottom: '8%',
        zIndex: 20,
      }}
    >
      <div 
        className={cn(
          "relative w-[160px] h-[120px] bg-[#E07850] transition-transform duration-500",
          isPasswordFocused && "scale-x-[-1]"
        )}
        style={{
          borderRadius: '80px 80px 0 0',
        }}
      >
        {/* 眼睛 */}
        {!isPasswordFocused && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 flex gap-8">
            <div className="relative h-4 w-4 rounded-full bg-[#1a1a2e]">
              <div 
                className="absolute h-1.5 w-1.5 rounded-full bg-white transition-all duration-100"
                style={{
                  left: `calc(50% + ${eyeOffset.x * 0.5}px - 3px)`,
                  top: `calc(30% + ${eyeOffset.y * 0.5}px - 3px)`,
                }}
              />
            </div>
            <div className="relative h-4 w-4 rounded-full bg-[#1a1a2e]">
              <div 
                className="absolute h-1.5 w-1.5 rounded-full bg-white transition-all duration-100"
                style={{
                  left: `calc(50% + ${eyeOffset.x * 0.5}px - 3px)`,
                  top: `calc(30% + ${eyeOffset.y * 0.5}px - 3px)`,
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
    const centerY = rect.top + rect.height / 4 - containerRect.top
    
    const offset = calculateEyeOffset(mousePosition.x, mousePosition.y, centerX, centerY, 3)
    setEyeOffset(offset)
  }, [mousePosition, containerRef])

  return (
    <div 
      ref={characterRef}
      className="absolute"
      style={{
        left: '35%',
        bottom: '12%',
        zIndex: 25,
      }}
    >
      <div 
        className={cn(
          "relative w-[70px] h-[100px] bg-[#1a1a2e] rounded-[8px] transition-transform duration-500",
          isPasswordFocused && "scale-x-[-1]"
        )}
      >
        {/* 眼睛 */}
        {!isPasswordFocused && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-3">
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

// 黄色圆角角色
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
        left: '50%',
        bottom: '10%',
        zIndex: 15,
      }}
    >
      <div 
        className={cn(
          "relative w-[80px] h-[90px] bg-[#D4A844] transition-transform duration-500",
          isPasswordFocused && "scale-x-[-1]"
        )}
        style={{
          borderRadius: '40px 40px 8px 8px',
        }}
      >
        {/* 眼睛 */}
        {!isPasswordFocused && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-4">
            <div className="relative h-2.5 w-2.5 rounded-full bg-[#1a1a2e]" />
            <div className="relative h-2.5 w-2.5 rounded-full bg-[#1a1a2e]" />
          </div>
        )}
        
        {/* 嘴巴 */}
        {!isPasswordFocused && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#1a1a2e] rounded-full" />
        )}
      </div>
    </div>
  )
}

// Google 图标
function GoogleIcon() {
  return (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export function LoginPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // 跟踪鼠标位置
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
      {/* 左侧角色区域 */}
      <div 
        ref={containerRef}
        className="relative hidden w-1/2 bg-[#2D3142] lg:block"
      >
        {/* 角色们 */}
        <div className="absolute inset-0 overflow-hidden">
          <BlueCharacter {...characterProps} />
          <OrangeCharacter {...characterProps} />
          <BlackCharacter {...characterProps} />
          <YellowCharacter {...characterProps} />
        </div>
        
        {/* 品牌标识 */}
        <div className="absolute left-8 top-8">
          <h1 className="text-2xl font-bold text-white">墨境</h1>
          <p className="text-sm text-white/60">AI 辅助创作平台</p>
        </div>
      </div>

      {/* 右侧登录表单 */}
      <div className="flex w-full flex-col items-center justify-center bg-[#F8F8F8] px-6 lg:w-1/2 lg:px-16">
        <div className="w-full max-w-md space-y-8">
          {/* 移动端 Logo */}
          <div className="mb-8 text-center lg:hidden">
            <h1 className="text-2xl font-bold text-foreground">墨境</h1>
            <p className="text-sm text-muted-foreground">AI 辅助创作平台</p>
          </div>

          {/* 标题 */}
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              欢迎回来
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              请输入您的账号信息登录
            </p>
          </div>

          {/* 表单 */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* 邮箱 */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                邮箱
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                className="h-12 border-muted-foreground/20 bg-white"
              />
            </div>

            {/* 密码 */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                密码
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className="h-12 border-muted-foreground/20 bg-white pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <label htmlFor="remember" className="text-sm text-muted-foreground">
                  30天内记住我
                </label>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-primary hover:underline"
              >
                忘记密码？
              </button>
            </div>

            {/* 登录按钮 */}
            <Button
              type="submit"
              className="h-12 w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
            >
              登录
            </Button>

            {/* 分割线 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted-foreground/20" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#F8F8F8] px-4 text-muted-foreground">或</span>
              </div>
            </div>

            {/* Google 登录 */}
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-full border-muted-foreground/20 bg-white hover:bg-muted/50"
            >
              <GoogleIcon />
              使用 Google 登录
            </Button>
          </form>

          {/* 注册链接 */}
          <p className="text-center text-sm text-muted-foreground">
            还没有账号？{" "}
            <button className="font-medium text-foreground hover:underline">
              立即注册
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
