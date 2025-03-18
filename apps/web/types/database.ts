export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      apps: {
        Row: {
          app_details: Json
          app_id: string
          app_type: string
          created_at: string
          enterprise_id: string
          package_name: string
          updated_at: string
        }
        Insert: {
          app_details: Json
          app_id?: string
          app_type: string
          created_at?: string
          enterprise_id: string
          package_name: string
          updated_at?: string
        }
        Update: {
          app_details?: Json
          app_id?: string
          app_type?: string
          created_at?: string
          enterprise_id?: string
          package_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "apps_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["enterprise_id"]
          },
        ]
      }
      device_application_reports: {
        Row: {
          application_report_id: string
          created_at: string
          device_uuid: string
          report_data: Json
          updated_at: string
        }
        Insert: {
          application_report_id?: string
          created_at?: string
          device_uuid: string
          report_data: Json
          updated_at?: string
        }
        Update: {
          application_report_id?: string
          created_at?: string
          device_uuid?: string
          report_data?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_reports_device_uuid_fkey"
            columns: ["device_uuid"]
            isOneToOne: true
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      device_hardware_metrics: {
        Row: {
          created_at: string
          device_uuid: string
          hardware_metrics_id: string
          measured_at: string
          metrics: Json
        }
        Insert: {
          created_at?: string
          device_uuid: string
          hardware_metrics_id?: string
          measured_at: string
          metrics: Json
        }
        Update: {
          created_at?: string
          device_uuid?: string
          hardware_metrics_id?: string
          measured_at?: string
          metrics?: Json
        }
        Relationships: [
          {
            foreignKeyName: "device_hardware_metrics_device_uuid_fkey"
            columns: ["device_uuid"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      device_history: {
        Row: {
          created_at: string
          device_history_id: string
          device_uuid: string
          request_details: Json | null
          response_details: Json
          updated_by_user_id: string | null
        }
        Insert: {
          created_at?: string
          device_history_id?: string
          device_uuid: string
          request_details?: Json | null
          response_details: Json
          updated_by_user_id?: string | null
        }
        Update: {
          created_at?: string
          device_history_id?: string
          device_uuid?: string
          request_details?: Json | null
          response_details?: Json
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devices_histories_device_uuid_fkey"
            columns: ["device_uuid"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      device_memory_events: {
        Row: {
          byte_count: number | null
          created_at: string
          device_uuid: string
          event_type: string
          measured_at: string
          memory_event_id: string
        }
        Insert: {
          byte_count?: number | null
          created_at?: string
          device_uuid: string
          event_type: string
          measured_at: string
          memory_event_id?: string
        }
        Update: {
          byte_count?: number | null
          created_at?: string
          device_uuid?: string
          event_type?: string
          measured_at?: string
          memory_event_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_events_device_uuid_fkey"
            columns: ["device_uuid"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      device_operations: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by_user_id: string | null
          device_id: string
          enterprise_id: string
          operation_id: string
          operation_name: string | null
          operation_request_data: Json | null
          operation_response_data: Json
          operation_type: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by_user_id?: string | null
          device_id: string
          enterprise_id: string
          operation_id?: string
          operation_name?: string | null
          operation_request_data?: Json | null
          operation_response_data: Json
          operation_type?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by_user_id?: string | null
          device_id?: string
          enterprise_id?: string
          operation_id?: string
          operation_name?: string | null
          operation_request_data?: Json | null
          operation_response_data?: Json
          operation_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "device_operations_enterprise_device_fkey"
            columns: ["enterprise_id", "device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["enterprise_id", "device_id"]
          },
        ]
      }
      device_power_events: {
        Row: {
          battery_level: number | null
          device_uuid: string
          event_type: string
          measured_at: string
          power_events_id: string
        }
        Insert: {
          battery_level?: number | null
          device_uuid: string
          event_type: string
          measured_at: string
          power_events_id?: string
        }
        Update: {
          battery_level?: number | null
          device_uuid?: string
          event_type?: string
          measured_at?: string
          power_events_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "power_management_events_device_uuid_fkey"
            columns: ["device_uuid"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      devices: {
        Row: {
          created_at: string
          device_details: Json
          device_display_name: string | null
          device_id: string
          enterprise_id: string
          id: string
          is_licensed: boolean
          last_operation_id: string | null
          policy_id: string | null
          requested_policy_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          device_details: Json
          device_display_name?: string | null
          device_id: string
          enterprise_id: string
          id?: string
          is_licensed?: boolean
          last_operation_id?: string | null
          policy_id?: string | null
          requested_policy_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          device_details?: Json
          device_display_name?: string | null
          device_id?: string
          enterprise_id?: string
          id?: string
          is_licensed?: boolean
          last_operation_id?: string | null
          policy_id?: string | null
          requested_policy_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "devices_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["enterprise_id"]
          },
          {
            foreignKeyName: "devices_last_operation_id_fkey"
            columns: ["last_operation_id"]
            isOneToOne: false
            referencedRelation: "device_operations"
            referencedColumns: ["operation_id"]
          },
          {
            foreignKeyName: "devices_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["policy_id"]
          },
          {
            foreignKeyName: "devices_requested_policy_id_fkey"
            columns: ["requested_policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["policy_id"]
          },
        ]
      }
      enterprise_history: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          enterprise_history_id: string
          enterprise_id: string
          request_details: Json
          response_details: Json
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          enterprise_history_id?: string
          enterprise_id: string
          request_details: Json
          response_details: Json
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          enterprise_history_id?: string
          enterprise_id?: string
          request_details?: Json
          response_details?: Json
        }
        Relationships: [
          {
            foreignKeyName: "enterprise_history_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["enterprise_id"]
          },
        ]
      }
      enterprises: {
        Row: {
          created_at: string
          enterprise_details: Json
          enterprise_id: string
          subscription_owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enterprise_details: Json
          enterprise_id: string
          subscription_owner_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enterprise_details?: Json
          enterprise_id?: string
          subscription_owner_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enterprises_subscription_owner_id_fkey"
            columns: ["subscription_owner_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["owner_id"]
          },
        ]
      }
      policies: {
        Row: {
          created_at: string
          enterprise_id: string
          is_default: boolean
          policy_details: Json
          policy_display_name: string
          policy_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enterprise_id: string
          is_default?: boolean
          policy_details: Json
          policy_display_name?: string
          policy_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enterprise_id?: string
          is_default?: boolean
          policy_details?: Json
          policy_display_name?: string
          policy_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "policies_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["enterprise_id"]
          },
        ]
      }
      policy_history: {
        Row: {
          created_at: string
          policy_history_id: string
          policy_id: string
          request_details: Json
          response_details: Json
          updated_by_user_id: string | null
        }
        Insert: {
          created_at?: string
          policy_history_id?: string
          policy_id: string
          request_details: Json
          response_details: Json
          updated_by_user_id?: string | null
        }
        Update: {
          created_at?: string
          policy_history_id?: string
          policy_id?: string
          request_details?: Json
          response_details?: Json
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "policy_history_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["policy_id"]
          },
        ]
      }
      project_members: {
        Row: {
          created_at: string
          project_id: string
          project_member_id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          project_id: string
          project_member_id?: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          project_id?: string
          project_member_id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          enterprise_id: string | null
          organization_name: string
          project_id: string
          project_name: string
          subscription_owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enterprise_id?: string | null
          organization_name: string
          project_id?: string
          project_name: string
          subscription_owner_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enterprise_id?: string | null
          organization_name?: string
          project_id?: string
          project_name?: string
          subscription_owner_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["enterprise_id"]
          },
          {
            foreignKeyName: "projects_subscription_owner_id_fkey"
            columns: ["subscription_owner_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["owner_id"]
          },
        ]
      }
      pubsub_message_logs: {
        Row: {
          created_at: string
          id: number
          message: Json | null
          message_attributes: Json | null
          message_id: string | null
          ordering_key: string | null
          publish_time: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          message?: Json | null
          message_attributes?: Json | null
          message_id?: string | null
          ordering_key?: string | null
          publish_time?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          message?: Json | null
          message_attributes?: Json | null
          message_id?: string | null
          ordering_key?: string | null
          publish_time?: string | null
        }
        Relationships: []
      }
      pubsub_messages: {
        Row: {
          created_at: string
          device_id: string | null
          enterprise_id: string | null
          message: Json
          message_attributes: Json
          message_id: string
          notification_type: string
          publish_time: string
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          enterprise_id?: string | null
          message: Json
          message_attributes: Json
          message_id: string
          notification_type: string
          publish_time: string
        }
        Update: {
          created_at?: string
          device_id?: string | null
          enterprise_id?: string | null
          message?: Json
          message_attributes?: Json
          message_id?: string
          notification_type?: string
          publish_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "pubsub_messages_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["enterprise_id"]
          },
        ]
      }
      service_limits: {
        Row: {
          created_at: string
          max_app_configs_per_app: number
          max_devices_kitting_per_user: number
          max_managed_apps_per_user: number
          max_policies_per_user: number
          max_projects_per_user: number
          max_ssids_per_user: number
          max_total_users: number
          service_limit_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          max_app_configs_per_app: number
          max_devices_kitting_per_user: number
          max_managed_apps_per_user: number
          max_policies_per_user: number
          max_projects_per_user: number
          max_ssids_per_user: number
          max_total_users: number
          service_limit_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          max_app_configs_per_app?: number
          max_devices_kitting_per_user?: number
          max_managed_apps_per_user?: number
          max_policies_per_user?: number
          max_projects_per_user?: number
          max_ssids_per_user?: number
          max_total_users?: number
          service_limit_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          device_limit: number
          email_support: boolean
          interval: string
          name: string
          phone_support: boolean
          plan_id: string
          policy_limit: number
          project_limit: number
          project_sharing: boolean
          subscription_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          device_limit?: number
          email_support?: boolean
          interval: string
          name: string
          phone_support?: boolean
          plan_id?: string
          policy_limit?: number
          project_limit?: number
          project_sharing?: boolean
          subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          device_limit?: number
          email_support?: boolean
          interval?: string
          name?: string
          phone_support?: boolean
          plan_id?: string
          policy_limit?: number
          project_limit?: number
          project_sharing?: boolean
          subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_plans_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: true
            referencedRelation: "subscriptions"
            referencedColumns: ["subscription_id"]
          },
        ]
      }
      subscription_usages: {
        Row: {
          active_devices: number
          created_at: string
          custom_policies: number
          inactive_devices: number
          last_reset: string
          monthly_data_transfer: number
          monthly_messages: number
          shared_projects: number
          subscription_id: string | null
          total_devices: number
          total_policies: number
          total_projects: number
          updated_at: string
          usage_id: string
        }
        Insert: {
          active_devices?: number
          created_at?: string
          custom_policies?: number
          inactive_devices?: number
          last_reset?: string
          monthly_data_transfer?: number
          monthly_messages?: number
          shared_projects?: number
          subscription_id?: string | null
          total_devices?: number
          total_policies?: number
          total_projects?: number
          updated_at?: string
          usage_id?: string
        }
        Update: {
          active_devices?: number
          created_at?: string
          custom_policies?: number
          inactive_devices?: number
          last_reset?: string
          monthly_data_transfer?: number
          monthly_messages?: number
          shared_projects?: number
          subscription_id?: string | null
          total_devices?: number
          total_policies?: number
          total_projects?: number
          updated_at?: string
          usage_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_usages_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: true
            referencedRelation: "subscriptions"
            referencedColumns: ["subscription_id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          owner_id: string
          plan_config: Json
          status: string
          stripe_subscription_id: string
          subscription_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          owner_id?: string
          plan_config: Json
          status: string
          stripe_subscription_id: string
          subscription_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          owner_id?: string
          plan_config?: Json
          status?: string
          stripe_subscription_id?: string
          subscription_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      usage_log_events: {
        Row: {
          created_at: string
          device_id: string | null
          enterprise_id: string | null
          event_details: Json
          event_id: string
          event_time: string
          event_type: string
          message_id: string
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          enterprise_id?: string | null
          event_details: Json
          event_id?: string
          event_time: string
          event_type: string
          message_id: string
        }
        Update: {
          created_at?: string
          device_id?: string | null
          enterprise_id?: string | null
          event_details?: Json
          event_id?: string
          event_time?: string
          event_type?: string
          message_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_log_events_enterprise_id_device_id_fkey"
            columns: ["enterprise_id", "device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["enterprise_id", "device_id"]
          },
          {
            foreignKeyName: "usage_log_events_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "pubsub_messages"
            referencedColumns: ["message_id"]
          },
        ]
      }
      users: {
        Row: {
          agree_to_terms: boolean
          created_at: string
          email: string
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          agree_to_terms?: boolean
          created_at?: string
          email: string
          updated_at?: string
          user_id?: string
          username: string
        }
        Update: {
          agree_to_terms?: boolean
          created_at?: string
          email?: string
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      waiting_users: {
        Row: {
          created_at: string
          email: string
          status: string
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          status?: string
          updated_at?: string
          user_id?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          status?: string
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      wifi_configurations: {
        Row: {
          configuration_details: Json
          configuration_id: string
          created_at: string
          enterprise_id: string
          updated_at: string
        }
        Insert: {
          configuration_details: Json
          configuration_id?: string
          created_at?: string
          enterprise_id: string
          updated_at?: string
        }
        Update: {
          configuration_details?: Json
          configuration_id?: string
          created_at?: string
          enterprise_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wifi_configurations_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["enterprise_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_device: {
        Args: {
          device_id: string
        }
        Returns: boolean
      }
      can_access_enterprise: {
        Args: {
          enterprise_id: string
        }
        Returns: boolean
      }
      can_access_policy: {
        Args: {
          policy_id: string
        }
        Returns: boolean
      }
      can_access_project: {
        Args: {
          project_id: string
        }
        Returns: boolean
      }
      can_access_usage_log_events: {
        Args: {
          pubsub_message_id: string
        }
        Returns: boolean
      }
      generate_device_display_name: {
        Args: {
          target_enterprise_id: string
        }
        Returns: string
      }
      generate_device_id_with_fallback: {
        Args: {
          target_enterprise_id: string
          prefix: string
          base_digits: number
          sub_digits: number
          separator: string
          overflow_prefix: string
        }
        Returns: string
      }
      generate_policy_identifier: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_accessible_enterprises: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      has_device_access: {
        Args: {
          device_uuid_param: string
        }
        Returns: boolean
      }
      has_enterprise_access: {
        Args: {
          enterprise_id_param: string
        }
        Returns: boolean
      }
      has_policy_access: {
        Args: {
          policy_id_param: string
        }
        Returns: boolean
      }
      insert_or_upsert_devices_data: {
        Args: {
          devices: Json[]
          device_hardware_metrics: Json[]
          device_memory_events: Json[]
          device_power_events: Json[]
          device_application_reports: Json[]
          device_history: Json[]
        }
        Returns: undefined
      }
      insert_or_upsert_devices_data_old: {
        Args: {
          devices: Json[]
          application_reports: Json[]
          memory_events: Json[]
          power_management_events: Json[]
          device_histories: Json[]
          device_displays: Json[]
          device_hardware_status: Json[]
          device_metrics: Json[]
        }
        Returns: undefined
      }
      is_active_subscriber: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      upsert_device_data_old: {
        Args: {
          devices: Json[]
          application_reports: Json[]
          memory_events: Json[]
          power_management_events: Json[]
          device_histories: Json[]
        }
        Returns: undefined
      }
      upsert_device_data_old_r1: {
        Args: {
          devices: Json[]
          application_reports: Json[]
          memory_events: Json[]
          power_management_events: Json[]
          device_histories: Json[]
          device_displays: Json[]
        }
        Returns: undefined
      }
      upsert_device_data_old_r2: {
        Args: {
          devices: Json[]
          application_reports: Json[]
          memory_events: Json[]
          power_management_events: Json[]
          device_histories: Json[]
          device_displays: Json[]
          device_hardware_status: Json[]
        }
        Returns: undefined
      }
      upsert_device_data_old_r3: {
        Args: {
          devices: Json[]
          application_reports: Json[]
          memory_events: Json[]
          power_management_events: Json[]
          device_histories: Json[]
          device_displays: Json[]
          device_hardware_status: Json[]
        }
        Returns: undefined
      }
      upsert_device_data_old_r4: {
        Args: {
          devices: Json[]
          application_reports: Json[]
          memory_events: Json[]
          power_management_events: Json[]
          device_histories: Json[]
          device_displays: Json[]
          device_hardware_status: Json[]
          device_metrics: Json[]
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

