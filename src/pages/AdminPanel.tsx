import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Users, Package, ArrowLeft, UserPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type AppRole = "admin" | "seller" | "buyer";

interface UserWithRoles {
  user_id: string;
  display_name: string | null;
  roles: AppRole[];
}

const AdminPanel = () => {
  const { user, hasRole, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [roleToAdd, setRoleToAdd] = useState<Record<string, AppRole>>({});

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const [{ data: profiles, error: pErr }, { data: roles, error: rErr }] = await Promise.all([
        supabase.from("profiles").select("user_id, display_name"),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (pErr) throw pErr;
      if (rErr) throw rErr;

      const roleMap: Record<string, AppRole[]> = {};
      roles?.forEach((r) => {
        if (!roleMap[r.user_id]) roleMap[r.user_id] = [];
        roleMap[r.user_id].push(r.role as AppRole);
      });

      return (profiles || []).map((p) => ({
        user_id: p.user_id,
        display_name: p.display_name,
        roles: roleMap[p.user_id] || [],
      })) as UserWithRoles[];
    },
    enabled: !!user && hasRole("admin"),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("id, name, seller_id, stock, price").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user && hasRole("admin"),
  });

  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Role added successfully");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Role removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user || !hasRole("admin")) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl font-semibold mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground mb-6">You need admin privileges to access this panel.</p>
          <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg">
            <ArrowLeft className="w-4 h-4" /> Go Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const availableRoles: AppRole[] = ["admin", "seller", "buyer"];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-semibold flex items-center gap-3">
              <Shield className="w-8 h-8 text-accent" /> Admin Panel
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{users.length} users · {products.length} products</p>
          </div>
        </div>

        {/* Users Section */}
        <section className="mb-12">
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" /> User Management
          </h2>
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Add Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
                ) : users.map((u) => (
                  <TableRow key={u.user_id}>
                    <TableCell>
                      <p className="font-medium">{u.display_name || "Unnamed"}</p>
                      <p className="text-xs text-muted-foreground">{u.user_id.slice(0, 8)}...</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {u.roles.map((role) => (
                          <span key={role} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-accent/10 text-accent">
                            {role}
                            {!(role === "buyer" && u.roles.length === 1) && (
                              <button
                                onClick={() => removeRoleMutation.mutate({ userId: u.user_id, role })}
                                className="hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={roleToAdd[u.user_id] || ""}
                          onValueChange={(v) => setRoleToAdd((prev) => ({ ...prev, [u.user_id]: v as AppRole }))}
                        >
                          <SelectTrigger className="w-28 h-8 text-xs">
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableRoles
                              .filter((r) => !u.roles.includes(r))
                              .map((r) => (
                                <SelectItem key={r} value={r}>{r}</SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <button
                          disabled={!roleToAdd[u.user_id]}
                          onClick={() => {
                            if (roleToAdd[u.user_id]) {
                              addRoleMutation.mutate({ userId: u.user_id, role: roleToAdd[u.user_id] });
                              setRoleToAdd((prev) => {
                                const n = { ...prev };
                                delete n[u.user_id];
                                return n;
                              });
                            }
                          }}
                          className="p-1.5 rounded-md bg-accent text-accent-foreground hover:bg-accent/80 disabled:opacity-40"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Products Overview */}
        <section>
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" /> All Products
          </h2>
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Seller</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>₹{p.price}</TableCell>
                    <TableCell>{p.stock}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.seller_id?.slice(0, 8) || "—"}...</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPanel;
