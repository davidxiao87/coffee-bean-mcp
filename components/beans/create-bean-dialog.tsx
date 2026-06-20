"use client"

import { Plus, X } from "lucide-react"
import { useMemo, useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type CreateBeanPayload = {
  name: string
  flavor_profile: string
  origin: string
  tags: string[]
  image_url: string
}

type FieldErrors = Partial<Record<keyof CreateBeanPayload, string>>

const EMPTY_FORM: CreateBeanPayload = {
  name: "",
  flavor_profile: "",
  origin: "",
  tags: [],
  image_url: "",
}

const TAG_SUGGESTIONS = [
  "花香",
  "果香",
  "坚果",
  "巧克力",
  "焦糖",
  "柑橘",
  "莓果",
  "奶油",
]

type Props = {
  onCreated?: () => void
}

export function CreateBeanDialog({ onCreated }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CreateBeanPayload>(EMPTY_FORM)
  const [tagInput, setTagInput] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const tagsValid = useMemo(
    () => form.tags.length > 0 && form.tags.length <= 10,
    [form.tags],
  )

  const isValid = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.flavor_profile.trim().length > 0 &&
      form.origin.trim().length > 0 &&
      form.image_url.trim().length > 0 &&
      tagsValid
    )
  }, [form, tagsValid])

  function reset() {
    setForm(EMPTY_FORM)
    setTagInput("")
    setError(null)
    setFieldErrors({})
    setSubmitting(false)
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      reset()
    }
  }

  function update<K extends keyof CreateBeanPayload>(
    key: K,
    value: CreateBeanPayload[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  function addTag(raw: string) {
    const tag = raw.trim().slice(0, 30)
    if (!tag) return
    setForm((prev) => {
      if (prev.tags.includes(tag) || prev.tags.length >= 10) return prev
      return { ...prev, tags: [...prev.tags, tag] }
    })
    setTagInput("")
  }

  function removeTag(tag: string) {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isValid || submitting) return

    setSubmitting(true)
    setError(null)
    setFieldErrors({})

    try {
      const response = await fetch("/api/beans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          flavor_profile: form.flavor_profile.trim(),
          origin: form.origin.trim(),
          tags: form.tags,
          image_url: form.image_url.trim(),
        }),
      })

      const contentType = response.headers.get("content-type") ?? ""
      const isJson = contentType.includes("application/json")
      const payload: {
        error?: string
        fieldErrors?: FieldErrors
      } = isJson
        ? ((await response.json()) as { error?: string; fieldErrors?: FieldErrors })
        : {}

      if (!response.ok) {
        if (payload.fieldErrors) {
          setFieldErrors(payload.fieldErrors)
        }
        setError(payload.error ?? "提交失败，请稍后再试。")
        return
      }

      setOpen(false)
      reset()
      onCreated?.()
    } catch (err) {
      console.error("[CreateBeanDialog] submit error", err)
      setError("网络异常，请检查连接后重试。")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-[#603809] text-white shadow-[0_10px_25px_-5px_rgba(96,56,9,0.45)] transition-transform hover:scale-110 hover:bg-[#7A4A1B] sm:bottom-10 sm:right-10"
        size="icon"
        aria-label="添加咖啡豆"
        title="添加咖啡豆"
      >
        <Plus className="size-6" />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="text-[#5C3A12]">添加新咖啡豆</DialogTitle>
            <DialogDescription>
              填写咖啡豆的基本信息，全部填完才能提交。
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="bean-name">
                咖啡名称 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bean-name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="例如：耶加雪菲"
                maxLength={80}
                aria-invalid={!!fieldErrors.name}
              />
              {fieldErrors.name ? (
                <p className="text-xs text-red-500">{fieldErrors.name}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bean-flavor">
                口味描述 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="bean-flavor"
                value={form.flavor_profile}
                onChange={(e) => update("flavor_profile", e.target.value)}
                placeholder="例如：明亮的柑橘酸，伴随茉莉花香与蜂蜜甜感"
                maxLength={500}
                rows={3}
                aria-invalid={!!fieldErrors.flavor_profile}
              />
              {fieldErrors.flavor_profile ? (
                <p className="text-xs text-red-500">{fieldErrors.flavor_profile}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bean-origin">
                产地 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bean-origin"
                value={form.origin}
                onChange={(e) => update("origin", e.target.value)}
                placeholder="例如：埃塞俄比亚 / 耶加雪菲"
                maxLength={80}
                aria-invalid={!!fieldErrors.origin}
              />
              {fieldErrors.origin ? (
                <p className="text-xs text-red-500">{fieldErrors.origin}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>
                标签 <span className="text-red-500">*</span>
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  至少 1 个，最多 10 个
                </span>
              </Label>

              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-[#F5DABD] px-3 py-1 text-xs font-medium text-[#6C451A]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 rounded-full p-0.5 hover:bg-[#EAC9A4]"
                      aria-label={`移除标签 ${tag}`}
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault()
                      addTag(tagInput)
                    }
                  }}
                  placeholder="输入标签后回车"
                  maxLength={30}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addTag(tagInput)}
                  disabled={!tagInput.trim() || form.tags.length >= 10}
                >
                  添加
                </Button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {TAG_SUGGESTIONS.filter((t) => !form.tags.includes(t)).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => addTag(t)}
                    disabled={form.tags.length >= 10}
                    className="rounded-full border border-[#E5C99F] bg-[#FFF5E8] px-2.5 py-0.5 text-xs text-[#8A5A28] transition-colors hover:bg-[#F5DABD] disabled:opacity-50"
                  >
                    + {t}
                  </button>
                ))}
              </div>

              {fieldErrors.tags ? (
                <p className="text-xs text-red-500">{fieldErrors.tags}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bean-image">
                图片 URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bean-image"
                type="url"
                value={form.image_url}
                onChange={(e) => update("image_url", e.target.value)}
                placeholder="https://..."
                maxLength={2048}
                aria-invalid={!!fieldErrors.image_url}
              />
              {form.image_url ? (
                <div className="mt-2 h-32 w-full overflow-hidden rounded-md border border-[#F0D7B7] bg-[#FFF9F1]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.image_url}
                    alt="预览"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).style.display = "none"
                    }}
                  />
                </div>
              ) : null}
              {fieldErrors.image_url ? (
                <p className="text-xs text-red-500">{fieldErrors.image_url}</p>
              ) : null}
            </div>

            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={submitting}
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={!isValid || submitting}
                className="bg-[#603809] text-white hover:bg-[#7A4A1B] disabled:cursor-not-allowed disabled:bg-[#603809]/40"
              >
                {submitting ? "提交中..." : "提交"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}