import type { Device, Loan, DeviceReport } from './models/inventory'
import type { Schedule, Material, Post, JournalEntry } from './models/content'
import type { UserProfile } from './models/user'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      devices: {
        Row: Device
        Insert: Partial<Device> & { name: string }
        Update: Partial<Device>
      }
      schedules: {
        Row: Schedule
        Insert: Partial<Schedule> & { title: string; date: string }
        Update: Partial<Schedule>
      }
      materials: {
        Row: Material
        Insert: Partial<Material> & { title: string }
        Update: Partial<Material>
      }
      posts: {
        Row: Post
        Insert: Partial<Post> & { title: string }
        Update: Partial<Post>
      }
      journal_entries: {
        Row: JournalEntry
        Insert: Partial<JournalEntry> & { title: string; date: string }
        Update: Partial<JournalEntry>
      }
      loans: {
        Row: Loan
        Insert: Partial<Loan>
        Update: Partial<Loan>
      }
      device_reports: {
        Row: DeviceReport
        Insert: Partial<DeviceReport>
        Update: Partial<DeviceReport>
      }
      user_profiles: {
        Row: UserProfile
        Insert: Partial<UserProfile>
        Update: Partial<UserProfile>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
