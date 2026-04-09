"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/fetcher";

type FAQRecord = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
};

export function FaqManager({ initialFaqs }: { initialFaqs: FAQRecord[] }) {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: "",
    sortOrder: 0,
    isActive: true,
  });

  const saveFaq = async (faq: FAQRecord) => {
    setIsSaving(faq.id);
    try {
      const updated = await apiFetch<FAQRecord>(`/api/faqs/${faq.id}`, {
        method: "PUT",
        body: JSON.stringify(faq),
      });
      setFaqs((current) => current.map((item) => (item.id === faq.id ? updated : item)));
      toast.success("FAQ saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save FAQ.");
    } finally {
      setIsSaving(null);
    }
  };

  const createFaq = async () => {
    setIsSaving("new");
    try {
      const created = await apiFetch<FAQRecord>("/api/faqs", {
        method: "POST",
        body: JSON.stringify(newFaq),
      });
      setFaqs((current) => [...current, created].sort((a, b) => a.sortOrder - b.sortOrder));
      setNewFaq({
        question: "",
        answer: "",
        sortOrder: 0,
        isActive: true,
      });
      toast.success("FAQ added.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add FAQ.");
    } finally {
      setIsSaving(null);
    }
  };

  const deleteItem = async (faqId: string) => {
    setIsSaving(faqId);
    try {
      await apiFetch(`/api/faqs/${faqId}`, {
        method: "DELETE",
      });
      setFaqs((current) => current.filter((faq) => faq.id !== faqId));
      toast.success("FAQ removed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to remove FAQ.");
    } finally {
      setIsSaving(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>New FAQ</CardTitle>
          <CardDescription>Add the high-confidence answers the bot can reuse during conversations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-question">Question</Label>
            <Input
              id="new-question"
              value={newFaq.question}
              onChange={(event) => setNewFaq((current) => ({ ...current, question: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-answer">Answer</Label>
            <Textarea
              id="new-answer"
              value={newFaq.answer}
              onChange={(event) => setNewFaq((current) => ({ ...current, answer: event.target.value }))}
            />
          </div>
          <div className="max-w-32 space-y-2">
            <Label htmlFor="new-sort">Sort order</Label>
            <Input
              id="new-sort"
              type="number"
              value={newFaq.sortOrder}
              onChange={(event) =>
                setNewFaq((current) => ({ ...current, sortOrder: Number(event.target.value || 0) }))
              }
            />
          </div>
          <Button disabled={isSaving === "new"} onClick={createFaq} type="button">
            {isSaving === "new" ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Add FAQ
          </Button>
        </CardContent>
      </Card>

      {faqs.map((faq) => (
        <Card key={faq.id}>
          <CardHeader>
            <CardTitle className="text-base">FAQ entry</CardTitle>
            <CardDescription>Keep answers precise so the bot avoids guessing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`question-${faq.id}`}>Question</Label>
              <Input
                id={`question-${faq.id}`}
                value={faq.question}
                onChange={(event) =>
                  setFaqs((current) =>
                    current.map((item) => (item.id === faq.id ? { ...item, question: event.target.value } : item)),
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`answer-${faq.id}`}>Answer</Label>
              <Textarea
                id={`answer-${faq.id}`}
                value={faq.answer}
                onChange={(event) =>
                  setFaqs((current) =>
                    current.map((item) => (item.id === faq.id ? { ...item, answer: event.target.value } : item)),
                  )
                }
              />
            </div>
            <div className="grid gap-4 md:grid-cols-[140px_1fr]">
              <div className="space-y-2">
                <Label htmlFor={`sort-${faq.id}`}>Sort order</Label>
                <Input
                  id={`sort-${faq.id}`}
                  type="number"
                  value={faq.sortOrder}
                  onChange={(event) =>
                    setFaqs((current) =>
                      current.map((item) =>
                        item.id === faq.id ? { ...item, sortOrder: Number(event.target.value || 0) } : item,
                      ),
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Actions</Label>
                <div className="flex gap-3">
                  <Button disabled={isSaving === faq.id} onClick={() => saveFaq(faq)} type="button">
                    {isSaving === faq.id ? <Loader2 className="size-4 animate-spin" /> : null}
                    Save FAQ
                  </Button>
                  <Button
                    disabled={isSaving === faq.id}
                    onClick={() => deleteItem(faq.id)}
                    type="button"
                    variant="outline"
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
