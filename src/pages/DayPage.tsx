import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Plus, Edit2, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useResources, LearningResource } from "@/hooks/useResources";

export default function DayPage() {
  const [searchParams] = useSearchParams();
  const selectedDate = searchParams.get("date") || format(new Date(), "yyyy-MM-dd");

  const {
    resources,
    addResource,
    updateResource,
    deleteResource,
    getResourcesByDate,
  } = useResources();

  const todayResources = getResourcesByDate(selectedDate);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<LearningResource | null>(null);

  const [formData, setFormData] = useState({
    url: "",
    title: "",
    resource_type: "video" as "video" | "article" | "course" | "docs" | "other",
    time_spent_minutes: 0,
    notes: "",
    is_completed: false,        // Default = In Progress
  });

  const openNewForm = () => {
    setEditingResource(null);
    setFormData({
      url: "",
      title: "",
      resource_type: "video",
      time_spent_minutes: 0,
      notes: "",
      is_completed: false,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.url.trim()) {
      toast.error("Title and URL are required");
      return;
    }

    const resourceData = {
      ...formData,
      date_completed: selectedDate,
    };

    if (editingResource) {
      updateResource(editingResource.id, resourceData);
    } else {
      addResource(resourceData);
    }

    setIsFormOpen(false);
    setEditingResource(null);
  };

  const startEdit = (resource: LearningResource) => {
    setEditingResource(resource);
    setFormData({
      url: resource.url,
      title: resource.title,
      resource_type: resource.resource_type,
      time_spent_minutes: resource.time_spent_minutes,
      notes: resource.notes || "",
      is_completed: resource.is_completed,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string | number) => {
    if (confirm("Delete this resource?")) {
      deleteResource(id);
    }
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Today</h1>
            <p className="text-zinc-400 mt-1">
              {format(parseISO(selectedDate), "EEEE, MMMM dd, yyyy")}
            </p>
          </div>

          <Button onClick={openNewForm} className="gap-2">
            <Plus className="w-5 h-5" />
            Add Resource
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <p className="text-sm text-zinc-400">Resources Today</p>
            <p className="text-4xl font-semibold mt-2">{todayResources.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-zinc-400">Time Spent</p>
            <p className="text-4xl font-semibold mt-2">
              {todayResources.reduce((sum, r) => sum + r.time_spent_minutes, 0)} min
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-zinc-400">Completed</p>
            <p className="text-4xl font-semibold mt-2 text-emerald-400">
              {todayResources.filter((r) => r.is_completed).length}
            </p>
          </Card>
        </div>

        {/* Resources List */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-xl font-semibold">Resources for {selectedDate}</h2>
          </div>

          {todayResources.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">
              No resources logged yet for this day.<br />
              Click "Add Resource" to get started.
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {todayResources.map((resource) => (
                <div
                  key={resource.id}
                  className="p-6 flex items-start justify-between hover:bg-zinc-900/50 group"
                >
                  <div className="flex-1 min-w-0">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-emerald-400 transition-colors line-clamp-1"
                    >
                      {resource.title}
                    </a>
                    <p className="text-sm text-zinc-500 mt-1 line-clamp-1">{resource.url}</p>

                    <div className="flex gap-3 mt-3 flex-wrap">
                      <span className="text-xs px-3 py-1 bg-zinc-800 text-white rounded-full">
                        {resource.resource_type}
                      </span>
                      <span className="text-xs px-3 py-1 bg-zinc-800 text-white rounded-full">
                        {resource.time_spent_minutes} min
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        resource.is_completed 
                          ? 'bg-emerald-900 text-emerald-300' 
                          : 'bg-amber-900 text-amber-300'
                      }`}>
                        {resource.is_completed ? "Completed" : "In Progress"}
                      </span>
                    </div>

                    {resource.notes && <p className="text-sm text-zinc-400 mt-3">{resource.notes}</p>}
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(resource)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(resource.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingResource ? "Edit Resource" : "Add New Resource"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="React 19 Deep Dive"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">URL</label>
              <Input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://react.dev/blog/2025/..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={formData.resource_type}
                  onValueChange={(value: any) => setFormData({ ...formData, resource_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="docs">Documentation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Time Spent (minutes)</label>
                <Input
                  type="number"
                  value={formData.time_spent_minutes || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    time_spent_minutes: e.target.value === "" ? 0 : parseInt(e.target.value) || 0
                  })}
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Simple Completion Toggle */}
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={formData.is_completed ? "Completed" : "In Progress"} 
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  is_completed: value === "Completed" 
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Key takeaways..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingResource ? "Update Resource" : "Add Resource"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
