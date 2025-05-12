import { Tractor } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../ui/sidebar'
import { ModeToggle } from '@/integrations/color-shemes/mode-toggle'

const ORSidebar = () => {
  const { open } = useSidebar()
  return (
    <Sidebar side="left" variant={open ? 'inset' : 'sidebar'}>
      <SidebarHeader className="flex flex-row items-center text-lg font-bold">
        <Tractor /> Ollama Ranch
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>App</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">Home</Link>
                </SidebarMenuButton>
                <SidebarMenuButton asChild>
                  <Link to="/chat">Chat</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ModeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}

export default ORSidebar
