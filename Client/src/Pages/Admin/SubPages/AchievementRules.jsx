import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Switch } from "../../../components/ui/switch";
import { fetchAllAdventures } from "../../../Api/adventure.api";
import { createAchievementRule, deleteAchievementRule, listAchievementRules, updateAchievementRule } from "../../../Api/user.api";
import { Trash2, Save, Plus } from "lucide-react";

export default function AchievementRulesPage() {
  const GLOBAL_ALL = "__GLOBAL__";
  const [adventures, setAdventures] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    label: "",
    adventure: GLOBAL_ALL,
    metric: "completedSessions",
    threshold: 1,
    active: true,
  });

  const metrics = useMemo(() => ([
    { value: "completedSessions", label: "Completed Sessions" },
    { value: "confirmedBookings", label: "Confirmed Bookings" },
  ]), []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [advRes, ruleRes] = await Promise.all([
        fetchAllAdventures(),
        listAchievementRules(),
      ]);

      // Normalize adventures response into an array
      const advList = advRes?.data?.adventures || [];
      setAdventures(advList);

      // Normalize rules response into an array
      const rulesRaw = ruleRes?.data;
      const ruleList = Array.isArray(rulesRaw?.data)
        ? rulesRaw.data
        : Array.isArray(rulesRaw)
          ? rulesRaw
          : [];
      setRules(ruleList);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load adventures or rules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => setForm({ name: "", description: "", label: "", adventure: GLOBAL_ALL, metric: "completedSessions", threshold: 1, active: true });

  const onCreate = async () => {
    if (!form.name?.trim()) return toast.error("Name is required");
    if (!form.threshold || form.threshold < 1) return toast.error("Threshold must be >= 1");
    setSaving(true);
    try {
  const payload = { ...form };
  if (payload.adventure === GLOBAL_ALL) payload.adventure = null;
      const res = await createAchievementRule(payload);
      toast.success(res?.message || "Rule created");
      resetForm();
      await loadData();
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Failed to create rule");
    } finally {
      setSaving(false);
    }
  };

  const onToggle = async (rule) => {
    try {
      await updateAchievementRule(rule._id, { active: !rule.active });
      await loadData();
    } catch (e) {
      toast.error("Failed to update rule");
    }
  };

  const onUpdate = async (rule) => {
    try {
      await updateAchievementRule(rule._id, rule);
      toast.success("Rule updated");
      await loadData();
    } catch (e) {
      toast.error("Failed to update rule");
    }
  };

  const onDelete = async (rule) => {
    if (!confirm(`Delete rule "${rule.name || rule.title}"?`)) return;
    try {
      await deleteAchievementRule(rule._id);
      toast.success("Rule deleted");
      await loadData();
    } catch (e) {
      toast.error("Failed to delete rule");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Achievement Rules</h2>
      </div>

      {/* Create new rule */}
      <Card>
        <CardHeader>
          <CardTitle>Create Rule</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Adventure Explorer" />
          </div>
          <div>
            <label className="text-sm font-medium">Label (Category)</label>
            <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Tree Climbing" />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="text-sm font-medium">Description</label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Complete 10 climbs" />
          </div>
          <div>
            <label className="text-sm font-medium">Adventure (optional)</label>
            <Select value={form.adventure} onValueChange={(v) => setForm({ ...form, adventure: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Global (All)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={GLOBAL_ALL}>Global (All Adventures)</SelectItem>
                {Array.isArray(adventures) && adventures.map((a) => (
                  <SelectItem key={a._id} value={a._id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Metric</label>
            <Select value={form.metric} onValueChange={(v) => setForm({ ...form, metric: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {metrics.map(m => (<SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Threshold</label>
            <Input type="number" min={1} value={form.threshold} onChange={(e) => setForm({ ...form, threshold: Number(e.target.value) })} />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
            <span>Active</span>
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex gap-2">
            <Button onClick={onCreate} disabled={saving} className="bg-black text-white">
              <Plus className="h-4 w-4 mr-2" /> Create Rule
            </Button>
            <Button variant="outline" onClick={resetForm}>Reset</Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing rules */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Adventure</TableHead>
                <TableHead>Metric</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7}>Loading...</TableCell></TableRow>
              ) : rules?.length === 0 ? (
                <TableRow><TableCell colSpan={7}>No rules found</TableCell></TableRow>
              ) : (
                rules.map((r) => (
                  <TableRow key={r._id}>
                    <TableCell className="font-medium">{r.name || r.title}</TableCell>
                    <TableCell>{r.label || "-"}</TableCell>
                    <TableCell>{r.adventure ? (Array.isArray(adventures) ? adventures.find(a => a._id === r.adventure)?.name : null) || r.adventure : "Global"}</TableCell>
                    <TableCell>{r.metric}</TableCell>
                    <TableCell>{r.threshold}</TableCell>
                    <TableCell>
                      <Switch checked={!!r.active} onCheckedChange={() => onToggle(r)} />
                    </TableCell>
                    <TableCell className="text-right flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => onUpdate(r)}>
                        <Save className="h-4 w-4 mr-1" /> Save
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onDelete(r)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
