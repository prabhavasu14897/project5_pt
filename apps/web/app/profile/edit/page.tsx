"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, Check, Save } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { AVATAR_PRESETS } from "@/lib/game/constants";
import { usePlayerStore } from "@/store/usePlayerStore";

const BIO_MAX = 160;

export default function EditProfilePage() {
  const router = useRouter();
  const hydrate = usePlayerStore((s) => s.hydrate);
  const hydrated = usePlayerStore((s) => s.hydrated);
  const displayName = usePlayerStore((s) => s.displayName);
  const playerTag = usePlayerStore((s) => s.playerTag);
  const avatarId = usePlayerStore((s) => s.avatarId);
  const bio = usePlayerStore((s) => s.bio);
  const updateProfile = usePlayerStore((s) => s.updateProfile);

  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("wolf");
  const [bioText, setBioText] = useState("");
  const [seeded, setSeeded] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (hydrated && !seeded) {
    setSeeded(true);
    setName(displayName);
    setSelectedAvatar(avatarId);
    setBioText(bio);
  }

  const handleSave = () => {
    updateProfile({
      displayName: name.trim() || "New Recruit",
      avatarId: selectedAvatar,
      bio: bioText.trim(),
    });
    setSavedFlash(true);
    window.setTimeout(() => {
      setSavedFlash(false);
      router.push("/profile");
    }, 500);
  };

  return (
    <PageShell>
      <Link href="/profile" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-white">
        <ChevronLeft className="h-4 w-4" /> Back to Profile
      </Link>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-display font-semibold uppercase tracking-wider text-primary">
            Profile / Account Settings
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-white">Edit Profile</h1>
          <p className="mt-1 text-sm text-text-secondary">Update your display name, avatar, and bio.</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel className="p-5 sm:p-6">
          <h2 className="font-display text-base font-bold text-white">Profile Avatar</h2>
          <div className="mt-4 flex items-center gap-4">
            <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-primary/40">
              <Image
                src={AVATAR_PRESETS.find((a) => a.id === selectedAvatar)?.src ?? AVATAR_PRESETS[0].src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </span>
            <div>
              <p className="font-display text-sm font-bold text-white">{name || "New Recruit"}</p>
              <p className="text-xs text-text-secondary">{playerTag}</p>
            </div>
          </div>

          <p className="mt-5 mb-2 text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">
            Select Preset Avatar
          </p>
          <div className="grid grid-cols-4 gap-2">
            {AVATAR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedAvatar(preset.id)}
                aria-pressed={selectedAvatar === preset.id}
                aria-label={preset.label}
                className={`relative aspect-square overflow-hidden rounded-lg border transition-colors ${
                  selectedAvatar === preset.id ? "border-primary" : "border-border hover:border-border-strong"
                }`}
              >
                <Image src={preset.src} alt={preset.label} fill sizes="80px" className="object-cover" />
                {selectedAvatar === preset.id && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-ink">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <h2 className="font-display text-base font-bold text-white">Gamer Identity</h2>

          <label className="mt-4 block">
            <span className="text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">
              Display Handle
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 24))}
              placeholder="New Recruit"
              className="mt-1.5 w-full rounded-md border border-border bg-surface-2 px-3 py-2.5 text-sm text-white outline-none placeholder:text-text-muted focus:border-primary"
            />
          </label>

          <p className="mt-3 text-xs text-text-secondary">
            Displayed on your profile and in your local match history. Not shared with anyone else —
            Memory Grid has no server.
          </p>

          <label className="mt-5 block">
            <span className="flex items-center justify-between text-[10px] font-display font-semibold uppercase tracking-wider text-text-secondary">
              Player Bio / Status Quote
              <span>{bioText.length}/{BIO_MAX}</span>
            </span>
            <textarea
              value={bioText}
              onChange={(e) => setBioText(e.target.value.slice(0, BIO_MAX))}
              rows={3}
              placeholder="Reflex enthusiast & speed-solving fanatic."
              className="mt-1.5 w-full resize-none rounded-md border border-border bg-surface-2 px-3 py-2.5 text-sm text-white outline-none placeholder:text-text-muted focus:border-primary"
            />
          </label>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <span className="text-xs text-text-secondary">
              {savedFlash ? <span className="font-semibold text-success">Saved!</span> : "Changes save locally."}
            </span>
            <div className="flex gap-2">
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  Discard
                </Button>
              </Link>
              <Button variant="primary" size="sm" icon={<Save className="h-3.5 w-3.5" />} onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
