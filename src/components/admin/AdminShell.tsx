"use client";

import * as React from "react";
import { Box, Container } from "@mui/material";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

type Props = {
  children: React.ReactNode;
  drawerWidth?: number;
};

export default function AdminShell({ children, drawerWidth = 292 }: Props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <Box className="relative min-h-screen overflow-hidden bg-transparent text-slate-950">
      <Box aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <Box className="absolute left-6 top-20 h-72 w-72 rounded-full bg-sky-300/24 blur-3xl" />
        <Box className="absolute right-10 top-10 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />
        <Box className="absolute bottom-[-8rem] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-200/20 blur-3xl" />
      </Box>

      <AdminTopbar
        drawerWidth={drawerWidth}
        onOpenMobile={() => setMobileOpen(true)}
      />
      <AdminSidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <Box
        component="main"
        sx={{
          ml: { md: `${drawerWidth}px` },
          pt: "76px",
        }}
      >
        <Container maxWidth="xl" className="py-8">
          {children}
        </Container>
      </Box>
    </Box>
  );
}
