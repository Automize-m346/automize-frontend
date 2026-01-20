terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.100"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_service_plan" "asp" {
  name                = var.app_service_plan_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "webapp" {
  name                = var.web_app_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  service_plan_id     = azurerm_service_plan.asp.id

  site_config {
    application_stack {
      docker_image     = var.docker_image
      docker_image_tag = "latest"
    }

    always_on = true
  }

  app_settings = {
    WEBSITES_PORT = "3000"
    NODE_ENV      = "production"

    DOCKER_REGISTRY_SERVER_URL      = "https://ghcr.io"
    DOCKER_REGISTRY_SERVER_USERNAME = var.ghcr_username
    DOCKER_REGISTRY_SERVER_PASSWORD = var.ghcr_token
  }
}