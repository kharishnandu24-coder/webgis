"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { MapPin, Menu, Search, Home, BarChart3, FileText, HelpCircle, Phone, Globe } from "lucide-react"
import Link from "next/link"

interface PublicLayoutProps {
  children: React.ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Home", href: "/public", icon: Home },
    { name: "Statistics", href: "/public/statistics", icon: BarChart3 },
    { name: "Public Map", href: "/public/map", icon: Globe },
    { name: "Claim Lookup", href: "/public/claims", icon: FileText },
    { name: "Resources", href: "/public/resources", icon: HelpCircle },
    { name: "Contact", href: "/public/contact", icon: Phone },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/public" className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-primary">FRA Atlas</h1>
                <p className="text-xs text-muted-foreground">Public Portal</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {navigation.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Search and Auth */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-8 w-64" />
                </div>
              </div>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Register</Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="flex flex-col space-y-4 mt-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center space-x-2 text-sm font-medium hover:text-primary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-6 w-6 text-primary" />
                <span className="font-bold text-primary">FRA Atlas</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Transparent forest rights management system empowering communities and ensuring accountability.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/public/statistics" className="text-muted-foreground hover:text-primary">
                    Public Statistics
                  </Link>
                </li>
                <li>
                  <Link href="/public/map" className="text-muted-foreground hover:text-primary">
                    Interactive Map
                  </Link>
                </li>
                <li>
                  <Link href="/public/claims" className="text-muted-foreground hover:text-primary">
                    Claim Lookup
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/public/resources" className="text-muted-foreground hover:text-primary">
                    FRA Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="/public/resources#faq" className="text-muted-foreground hover:text-primary">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/public/contact" className="text-muted-foreground hover:text-primary">
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Ministry of Environment, Forest and Climate Change</p>
                <p>Government of India</p>
                <p>Email: support@fra-atlas.gov.in</p>
                <p>Phone: 1800-XXX-XXXX</p>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 FRA Atlas. All rights reserved. Built for transparent forest rights management.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
