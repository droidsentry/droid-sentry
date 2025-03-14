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
      application_reports: {
        Row: {
          application_report_data: Json
          created_at: string
          device_identifier: string
          enterprise_id: string
          updated_at: string
        }
        Insert: {
          application_report_data: Json
          created_at?: string
          device_identifier: string
          enterprise_id: string
          updated_at: string
        }
        Update: {
          application_report_data?: Json
          created_at?: string
          device_identifier?: string
          enterprise_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_reports_enterprise_id_device_identifier_fkey"
            columns: ["enterprise_id", "device_identifier"]
            isOneToOne: true
            referencedRelation: "devices"
            referencedColumns: ["enterprise_id", "device_identifier"]
          },
        ]
      }
      apps: {
        Row: {
          app_data: Json
          app_id: string
          app_type: string
          created_at: string
          enterprise_id: string
          package_name: string
          updated_at: string
        }
        Insert: {
          app_data: Json
          app_id?: string
          app_type: string
          created_at?: string
          enterprise_id: string
          package_name: string
          updated_at: string
        }
        Update: {
          app_data?: Json
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
      device_displays: {
        Row: {
          created_at: string | null
          device_identifier: string
          displays: Json[]
          enterprise_id: string
          last_status_report_time: string
        }
        Insert: {
          created_at?: string | null
          device_identifier: string
          displays: Json[]
          enterprise_id: string
          last_status_report_time: string
        }
        Update: {
          created_at?: string | null
          device_identifier?: string
          displays?: Json[]
          enterprise_id?: string
          last_status_report_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_displays_enterprise_id_device_identifier_fkey"
            columns: ["enterprise_id", "device_identifier"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["enterprise_id", "device_identifier"]
          },
        ]
      }
      device_hardware_status: {
        Row: {
          create_time: string
          created_at: string
          device_identifier: string
          enterprise_id: string
          hardware_status: Json
        }
        Insert: {
          create_time: string
          created_at?: string
          device_identifier: string
          enterprise_id: string
          hardware_status: Json
        }
        Update: {
          create_time?: string
          created_at?: string
          device_identifier?: string
          enterprise_id?: string
          hardware_status?: Json
        }
        Relationships: [
          {
            foreignKeyName: "device_hardware_status_device_fkey"
            columns: ["enterprise_id", "device_identifier"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["enterprise_id", "device_identifier"]
          },
        ]
      }
      device_metrics: {
        Row: {
          battery_temperatures: number[] | null
          cpu_temperatures: number[] | null
          cpu_usages: number[] | null
          create_time: string
          created_at: string
          device_identifier: string
          enterprise_id: string
          fan_speeds: number[] | null
          gpu_temperatures: number[] | null
          skin_temperatures: number[] | null
        }
        Insert: {
          battery_temperatures?: number[] | null
          cpu_temperatures?: number[] | null
          cpu_usages?: number[] | null
          create_time: string
          created_at?: string
          device_identifier: string
          enterprise_id: string
          fan_speeds?: number[] | null
          gpu_temperatures?: number[] | null
          skin_temperatures?: number[] | null
        }
        Update: {
          battery_temperatures?: number[] | null
          cpu_temperatures?: number[] | null
          cpu_usages?: number[] | null
          create_time?: string
          created_at?: string
          device_identifier?: string
          enterprise_id?: string
          fan_speeds?: number[] | null
          gpu_temperatures?: number[] | null
          skin_temperatures?: number[] | null
        }
        Relationships: [
          {
            foreignKeyName: "device_metrics_device_fkey"
            columns: ["enterprise_id", "device_identifier"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["enterprise_id", "device_identifier"]
          },
        ]
      }
      devices: {
        Row: {
          created_at: string
          device_data: Json
          device_display_name: string | null
          device_id: string
          device_identifier: string | null
          enterprise_id: string
          is_licensed: boolean
          operation_data: Json | null
          policy_identifier: string | null
          requested_policy_identifier: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          device_data: Json
          device_display_name?: string | null
          device_id?: string
          device_identifier?: string | null
          enterprise_id: string
          is_licensed?: boolean
          operation_data?: Json | null
          policy_identifier?: string | null
          requested_policy_identifier?: string | null
          updated_at: string
        }
        Update: {
          created_at?: string
          device_data?: Json
          device_display_name?: string | null
          device_id?: string
          device_identifier?: string | null
          enterprise_id?: string
          is_licensed?: boolean
          operation_data?: Json | null
          policy_identifier?: string | null
          requested_policy_identifier?: string | null
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
            foreignKeyName: "devices_enterprise_id_requested_policy_identifier_fkey"
            columns: ["enterprise_id", "requested_policy_identifier"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["enterprise_id", "policy_identifier"]
          },
          {
            foreignKeyName: "devices_policy_reference_fkey"
            columns: ["enterprise_id", "policy_identifier"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["enterprise_id", "policy_identifier"]
          },
        ]
      }
      devices_histories: {
        Row: {
          created_at: string
          device_history_id: string
          device_identifier: string
          device_request_data: Json | null
          device_response_data: Json
          enterprise_id: string
          updated_by_user_id: string | null
        }
        Insert: {
          created_at?: string
          device_history_id?: string
          device_identifier: string
          device_request_data?: Json | null
          device_response_data: Json
          enterprise_id: string
          updated_by_user_id?: string | null
        }
        Update: {
          created_at?: string
          device_history_id?: string
          device_identifier?: string
          device_request_data?: Json | null
          device_response_data?: Json
          enterprise_id?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devices_histories_enterprise_id_device_identifier_fkey"
            columns: ["enterprise_id", "device_identifier"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["enterprise_id", "device_identifier"]
          },
        ]
      }
      enterprises: {
        Row: {
          created_at: string
          enterprise_data: Json
          enterprise_id: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enterprise_data: Json
          enterprise_id: string
          owner_id?: string
          updated_at: string
        }
        Update: {
          created_at?: string
          enterprise_data?: Json
          enterprise_id?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enterprises_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["owner_id"]
          },
        ]
      }
      enterprises_histories: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          enterprise_id: string
          enterprise_request_data: Json
          enterprise_response_data: Json
          enterprises_history_id: string
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          enterprise_id: string
          enterprise_request_data: Json
          enterprise_response_data: Json
          enterprises_history_id?: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          enterprise_id?: string
          enterprise_request_data?: Json
          enterprise_response_data?: Json
          enterprises_history_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enterprises_histories_enterprise_id_fkey"
            columns: ["enterprise_id"]
            isOneToOne: false
            referencedRelation: "enterprises"
            referencedColumns: ["enterprise_id"]
          },
        ]
      }
      memory_events: {
        Row: {
          byte_count: number | null
          create_time: string
          created_at: string
          device_identifier: string
          enterprise_id: string
          event_type: string
        }
        Insert: {
          byte_count?: number | null
          create_time: string
          created_at?: string
          device_identifier: string
          enterprise_id: string
          event_type: string
        }
        Update: {
          byte_count?: number | null
          create_time?: string
          created_at?: string
          device_identifier?: string
          enterprise_id?: string
          event_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_events_enterprise_id_device_identifier_fkey"
            columns: ["enterprise_id", "device_identifier"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["enterprise_id", "device_identifier"]
          },
        ]
      }
      operations: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          device_identifier: string
          enterprise_id: string
          operation_id: string
          operation_name: string | null
          operation_request_data: Json | null
          operation_response_data: Json
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          device_identifier: string
          enterprise_id: string
          operation_id?: string
          operation_name?: string | null
          operation_request_data?: Json | null
          operation_response_data: Json
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          device_identifier?: string
          enterprise_id?: string
          operation_id?: string
          operation_name?: string | null
          operation_request_data?: Json | null
          operation_response_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "operations_enterprise_id_device_identifier_fkey"
            columns: ["enterprise_id", "device_identifier"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["enterprise_id", "device_identifier"]
          },
        ]
      }
      policies: {
        Row: {
          created_at: string
          enterprise_id: string
          policy_data: Json
          policy_display_name: string
          policy_id: string
          policy_identifier: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enterprise_id: string
          policy_data: Json
          policy_display_name?: string
          policy_id?: string
          policy_identifier: string
          updated_at: string
        }
        Update: {
          created_at?: string
          enterprise_id?: string
          policy_data?: Json
          policy_display_name?: string
          policy_id?: string
          policy_identifier?: string
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
      policies_histories: {
        Row: {
          created_at: string
          policy_history_id: string
          policy_id: string
          policy_request_data: Json
          policy_response_data: Json
          updated_by_user_id: string
        }
        Insert: {
          created_at?: string
          policy_history_id?: string
          policy_id: string
          policy_request_data: Json
          policy_response_data: Json
          updated_by_user_id?: string
        }
        Update: {
          created_at?: string
          policy_history_id?: string
          policy_id?: string
          policy_request_data?: Json
          policy_response_data?: Json
          updated_by_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "policies_histories_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["policy_id"]
          },
        ]
      }
      power_management_events: {
        Row: {
          battery_level: number | null
          create_time: string
          device_identifier: string
          enterprise_id: string
          event_type: string
        }
        Insert: {
          battery_level?: number | null
          create_time: string
          device_identifier: string
          enterprise_id: string
          event_type: string
        }
        Update: {
          battery_level?: number | null
          create_time?: string
          device_identifier?: string
          enterprise_id?: string
          event_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "power_management_events_enterprise_id_device_identifier_fkey"
            columns: ["enterprise_id", "device_identifier"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["enterprise_id", "device_identifier"]
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
          updated_at: string
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
          owner_id: string
          project_id: string
          project_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enterprise_id?: string | null
          organization_name: string
          owner_id?: string
          project_id?: string
          project_name: string
          updated_at: string
        }
        Update: {
          created_at?: string
          enterprise_id?: string | null
          organization_name?: string
          owner_id?: string
          project_id?: string
          project_name?: string
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
            foreignKeyName: "projects_owner_id_fkey1"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["owner_id"]
          },
        ]
      }
      pubsub_logs: {
        Row: {
          attributes: Json | null
          created_at: string
          id: number
          message_id: string | null
          ordering_key: string | null
          publish_time: string | null
          pubsub_data: Json | null
        }
        Insert: {
          attributes?: Json | null
          created_at?: string
          id?: number
          message_id?: string | null
          ordering_key?: string | null
          publish_time?: string | null
          pubsub_data?: Json | null
        }
        Update: {
          attributes?: Json | null
          created_at?: string
          id?: number
          message_id?: string | null
          ordering_key?: string | null
          publish_time?: string | null
          pubsub_data?: Json | null
        }
        Relationships: []
      }
      pubsub_messages: {
        Row: {
          created_at: string
          device_identifier: string | null
          enterprise_id: string | null
          notification_type: string
          publish_time: string
          pubsub_message_attributes_data: Json
          pubsub_message_data: Json
          pubsub_message_id: string
        }
        Insert: {
          created_at?: string
          device_identifier?: string | null
          enterprise_id?: string | null
          notification_type: string
          publish_time: string
          pubsub_message_attributes_data: Json
          pubsub_message_data: Json
          pubsub_message_id: string
        }
        Update: {
          created_at?: string
          device_identifier?: string | null
          enterprise_id?: string | null
          notification_type?: string
          publish_time?: string
          pubsub_message_attributes_data?: Json
          pubsub_message_data?: Json
          pubsub_message_id?: string
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
          updated_at: string
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
          updated_at: string
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
          updated_at: string
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
          pubsub_message_id: string
          usage_log_event_data: Json
          usage_log_event_id: string
          usage_log_event_time: string
          usage_log_event_type: string
        }
        Insert: {
          created_at?: string
          pubsub_message_id: string
          usage_log_event_data: Json
          usage_log_event_id?: string
          usage_log_event_time: string
          usage_log_event_type: string
        }
        Update: {
          created_at?: string
          pubsub_message_id?: string
          usage_log_event_data?: Json
          usage_log_event_id?: string
          usage_log_event_time?: string
          usage_log_event_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_log_events_pubsub_message_id_fkey"
            columns: ["pubsub_message_id"]
            isOneToOne: false
            referencedRelation: "pubsub_messages"
            referencedColumns: ["pubsub_message_id"]
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
          updated_at: string
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
          status: string
          updated_at: string
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
      wifi_network_configurations: {
        Row: {
          config: Json
          created_at: string
          enterprise_id: string
          updated_at: string
          wifi_network_configuration_id: string
        }
        Insert: {
          config: Json
          created_at?: string
          enterprise_id: string
          updated_at: string
          wifi_network_configuration_id?: string
        }
        Update: {
          config?: Json
          created_at?: string
          enterprise_id?: string
          updated_at?: string
          wifi_network_configuration_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wifi_network_configurations_enterprise_id_fkey"
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
      insert_or_upsert_devices_data: {
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

