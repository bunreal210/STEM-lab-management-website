import type { Device, Loan, DeviceReport } from './models/inventory'
import type { Schedule, Material, Post, JournalEntry } from './models/content'
import type { UserProfile } from './models/user'

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type GenericRow<T> = T & Record<string, unknown>

export interface Database {
  public: {
    Tables: {
      devices: {
        Row: GenericRow<Device>
        Insert: GenericRow<Partial<Device>>
        Update: GenericRow<Partial<Device>>
        Relationships: []
      }
      schedules: {
        Row: GenericRow<Schedule>
        Insert: GenericRow<Partial<Schedule>>
        Update: GenericRow<Partial<Schedule>>
        Relationships: []
      }
      materials: {
        Row: GenericRow<Material>
        Insert: GenericRow<Partial<Material>>
        Update: GenericRow<Partial<Material>>
        Relationships: []
      }
      posts: {
        Row: GenericRow<Post>
        Insert: GenericRow<Partial<Post>>
        Update: GenericRow<Partial<Post>>
        Relationships: []
      }
      journal_entries: {
        Row: GenericRow<JournalEntry>
        Insert: GenericRow<Partial<JournalEntry>>
        Update: GenericRow<Partial<JournalEntry>>
        Relationships: []
      }
      loans: {
        Row: GenericRow<Loan>
        Insert: GenericRow<Partial<Loan>>
        Update: GenericRow<Partial<Loan>>
        Relationships: []
      }
      device_reports: {
        Row: GenericRow<DeviceReport>
        Insert: GenericRow<Partial<DeviceReport>>
        Update: GenericRow<Partial<DeviceReport>>
        Relationships: []
      }
      user_profiles: {
        Row: GenericRow<UserProfile>
        Insert: GenericRow<Partial<UserProfile>>
        Update: GenericRow<Partial<UserProfile>>
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
