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
        Insert: Partial<Device>
        Update: Partial<Device>
        Relationships: []
      }
      schedules: {
        Row: Schedule
        Insert: Partial<Schedule>
        Update: Partial<Schedule>
        Relationships: []
      }
      materials: {
        Row: Material
        Insert: Partial<Material>
        Update: Partial<Material>
        Relationships: []
      }
      posts: {
        Row: Post
        Insert: Partial<Post>
        Update: Partial<Post>
        Relationships: []
      }
      journal_entries: {
        Row: JournalEntry
        Insert: Partial<JournalEntry>
        Update: Partial<JournalEntry>
        Relationships: []
      }
      loans: {
        Row: Loan
        Insert: Partial<Loan>
        Update: Partial<Loan>
        Relationships: []
      }
      device_reports: {
        Row: DeviceReport
        Insert: Partial<DeviceReport>
        Update: Partial<DeviceReport>
        Relationships: []
      }
      user_profiles: {
        Row: UserProfile
        Insert: Partial<UserProfile>
        Update: Partial<UserProfile>
        Relationships: []
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
