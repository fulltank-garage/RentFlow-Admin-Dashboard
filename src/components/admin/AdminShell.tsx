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
    <Box className="min-h-screen bg-slate-50">
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
          pt: "64px",
        }}
      >
        <Container maxWidth="xl" className="py-6">
          {children}
        </Container>
      </Box>
    </Box>
  );
}
