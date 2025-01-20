# enterprise Database Schema

## テーブル一覧

- users
- enterprises
- projects
- policies
- devices
- events
- operations
- memory_events
- power_management_events
- application_reports
- devices_histories
- enterprises_histories
- pubsub_messages

## 記号の意味

- PK: Primary Key
- FK: Foreign Key
- ||--o{ : 1 対多の関係
- ||--|| : 1 対 1 の関係
- }o--o{ : 多対多の関係
- ex) enterprises ||--o{ projects : "has" は「エンタープライズは複数のプロジェクトを持つ」という意味

## Entity Relationship Diagram

```mermaid
erDiagram
    %% ユーザー管理
    users ||--o{ enterprises : "has"
    users ||--o{ project_members : "has"
    users ||--o{ subscriptions : "has"
    subscriptions ||--|| subscription_plans : "has"
    subscriptions ||--|| subscription_usages : "has"

    %% プロジェクト管理
    enterprises ||--o{ projects : "has"
    projects ||--o{ project_members : "has users"

    %% ポリシー管理
    enterprises ||--o{ policies : "has"
    policies ||--o{ policies_histories : "has"
    policies ||--o{ devices : "applies to"

    %% デバイス管理
    enterprises ||--o{ devices : "has"
    devices ||--o{ application_reports : "generates"
    devices ||--o{ memory_events : "generates"
    devices ||--o{ power_management_events : "generates"
    devices ||--o{ devices_histories : "has"
    devices ||--o{ operations : "has"
    devices ||--o{ usage_log_events : "has"

    %% アプリ管理
    enterprises ||--o{ apps : "has"

    %% PubSub管理
    pubsub_messages ||--o{ devices_histories : "records"
    pubsub_messages ||--o{ operations : "records"
    pubsub_messages ||--o{ usage_log_events : "records"

    %% エンタープライズ管理
    enterprises ||--o{ enterprises_histories : "has"

    users {
        uuid id PK,FK "default auth.uid(), FK is Removed: Cascade"
        text email UK "メールアドレス"
        text username UK "ユーザー名"
        timestamptz created_at "default now()"
        timestamptz updated_at
}

    subscriptions {
        uuid id PK "default gen_random_uuid()"
        uuid user_id FK,UK "default auth.uid(), FK is Removed: Restrict"
        text stripe_subscription_id UK "Stripeサブスクリプション識別子"
        text status "active, inactive, canceled等"
        timestamptz current_period_start "現在の課金期間開始"
        timestamptz current_period_end "現在の課金期間終了"
        timestamptz created_at "default now()"
        timestamptz updated_at
    }

    subscription_plans {
        uuid subscription_plans_id PK "default gen_random_uuid()"
        uuid subscription_id FK,UK "FK is delete cascade"
        text plan_name "プラン名"
        text interval "monthly, yearly等"
        boolean email_support "default false"
        boolean phone_support "default false"
        integer device_limit "default 1"
        integer policy_limit "default 1"
        integer project_limit "default 1"
        integer project_sharing "default 1"
        timestamptz created_at "default now()"
        timestamptz updated_at
    }

    subscription_usages {
        uuid usage_id PK "default gen_random_uuid ()"
        uuid subscription_id FK "FK is delete cascade"
        int monthly_messages "default 0"
        int monthly_data_transfer "default 0"
        int total_devices "default 0"
        int active_devices "default 0"
        int inactive_devices "default 0"
        int total_policies "default 0"
        int custom_policies "default 0"
        int total_projects "default 0"
        int shared_projects "default 0"
        timestamptz last_reset
        timestamptz created_at "default now()"
        timestamptz updated_at
    }

    projects {
        uuid project_id PK "default gen_random_uuid ()"
        uuid owner_id FK "default auth.uid (), FK is Removed : Restrict"
        text enterprise_id FK "FK is removed : Cascade , Is Nullable"
        text project_name
        text organization_name
        timestamptz created_at "default now()"
        timestamptz updated_at
    }

    project_members {
        uuid project_member_id PK "default gen_random_uuid ()"
        uuid project_id FK "FK is removed : Cascade"
        uuid user_id FK "FK is Removed : Cascade"
        text role
        timestamptz created_at "default now()"
        timestamptz updated_at
    }

    enterprises {
        text enterprise_id PK
        uuid owner_id FK "default auth.uid (), FK is delete restrict"
        jsonb enterprise_data
        timestamptz created_at "default now()"
        timestamptz updated_at
    }
    %% This table is retained for 30 days, after which it is automatically deleted.
    enterprises_histories {
        uuid enterprises_history_id PK "default gen_random_uuid ()"
        text enterprise_id FK "Action Removed : Cascade"
        jsonb enterprise_request_data
        jsonb enterprise_response_data
        uuid created_by_user_id FK "default auth.uid (), FK is removed : Set Null"
        timestamp created_at "default now()"
    }

    apps {
        uuid app_id PK "default gen_random_uuid ()"
        text enterprise_id FK,UK "FK is removed : Cascade, UK(enterprise_id, package_name)"
        text package_name UK "UK(enterprise_id, package_name)"
        text app_type
        jsonb app_data
        timestamptz created_at "default now()"
        timestamptz updated_at
    }

    policies {
        uuid policy_id PK "default gen_random_uuid ()"
        text enterprise_id FK "FK is removed : Cascade"
        text policy_identifier UK "unique (enterprise_id, policy_identifier)"
        text policy_display_name
        jsonb policy_data
        timestamptz created_at "default now()"
        timestamptz updated_at
    }

    %% This table is retained for 30 days, after which it is automatically deleted.
    policies_histories {
        uuid policy_history_id PK "default gen_random_uuid ()"
        uuid policy_id FK "FK is removed : Cascade"
        jsonb policy_request_data
        jsonb policy_response_data
        uuid updated_by_user_id FK "auth.user.id , FK is removed : Set Null"
        timestamptz created_at "default now()"
    }

    devices {
        uuid device_id PK "default gen_random_uuid ()"
        text enterprise_id FK,UK "FK is delete cascade, UK(enterprise_id, device_identifier)"
        text device_identifier UK "FK is delete set null, UK(enterprise_id, device_identifier)"
        text policy_identifier FK,UK  "FK is delete set null, UK(enterprise_id, policy_identifier)"
        text device_display_name "Is Nullable"
        boolean is_licensed  "default false"
        jsonb device_data "devices_historiesの最新response_data "
        jsonb operation_data "operationsの最新operation_response_data, Is Nullable"
        timestamptz created_at "default now()"
        timestamptz updated_at
    }
    %% This table is retained for 30 days, after which it is automatically deleted.
    devices_histories {
        uuid device_history_id PK "default gen_random_uuid ()"
        text enterprise_id FK "delete cascad"
        text device_identifier FK "delete cascad"
        jsonb device_request_data "Is Nullable"
        jsonb device_response_data
        uuid updated_by_user_id FK "default auth.uid () , FK row is removed : Set Null"
        timestamptz created_at "default now()"
    }

    application_reports {
        text enterprise_id PK,FK "FK is delete cascade"
        text device_identifier PK,FK "FK is delete cascade"
        jsonb application_report_data
        timestamptz created_at "default now()"
        timestamptz updated_at
    }

    memory_events {
        text device_identifier PK,FK "FK is delete cascade"
        text enterprise_id PK,FK "FK is delete cascade"
        jsonb memory_event_data
        timestamptz created_at "default now()"
        timestamptz updated_at
    }

    power_management_events {
        text enterprise_id PK,FK "FK is removed : Cascade"
        text device_identifier PK,FK "FK is removed : Cascade"
        jsonb power_management_event_data
        timestamptz created_at "default now()"
        timestamptz updated_at
    }
    %% This table is retained for 90 days, after which it is automatically deleted.
    operations {
        uuid operation_id PK "default gen_random_uuid ()"
        text device_identifier FK
        text enterprise_id FK "Action referenced row is removed : Cascade"
        text operation_name "operations/{unique_id} の{unique_id} のみ ※getOperationで使用"
        jsonb operation_request_data "Is Nullable"
        jsonb operation_response_data
        uuid created_by_user_id FK "default auth.uid () , FK is removed : Set Null"
        timestamptz created_at "default now()"
    }

    usage_log_events {
        uuid usage_log_event_id PK "default gen_random_uuid ()"
        text pubsub_message_id FK "FK is removed : Cascade"
        timestamptz usage_log_event_time "UsageLogEvent.eventTime"
        text usage_log_event_type
        jsonb event_data
        timestamptz created_at "default now()"
    }
    %% This table is retained for 90 days, after which it is automatically deleted.
    pubsub_messages {
        text pubsub_message_id PK
        text enterprise_id FK "Is Nullable, FK is delete cascade"
        text device_identifier "Is Nullable"
        text notification_type
        jsonb pubsub_message_data
        jsonb pubsub_message_attributes_data
        timestamptz publish_time
        timestamptz created_at "default now()"
    }
```
