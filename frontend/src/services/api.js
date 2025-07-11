const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    if (options.body) {
      if (typeof options.body === "object") {
        config.body = JSON.stringify(options.body)
      } else if (typeof options.body === "string") {
        config.body = options.body
      }
    }
    if (config.body && (!config.headers["Content-Type"] || config.headers["Content-Type"] !== "application/json")) {
      config.headers["Content-Type"] = "application/json"
    }
    console.log("Final fetch config:", config)

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Request failed")
      }

      return data
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("Network error - please check your connection")
      }
      throw error
    }
  }

  setAuthHeader(token) {
    return {
      Authorization: `Bearer ${token}`,
    }
  }
}

class AuthService extends ApiService {
  async login(email, password) {
    return this.request("/auth/login", {
      method: "POST",
      body: { email, password },
    })
  }

  async register(name, email, password) {
    return this.request("/auth/register", {
      method: "POST",
      body: { name, email, password },
    })
  }

  async deleteAccount(token) {
    return this.request("/auth/delete", {
      method: "DELETE",
      headers: this.setAuthHeader(token),
    })
  }
}

class MedicationService extends ApiService {
  async getAll(token) {
    return this.request("/medications", {
      headers: this.setAuthHeader(token),
    })
  }

  async create(medicationData, token) {
    return this.request("/medications", {
      method: "POST",
      headers: this.setAuthHeader(token),
      body: medicationData,
    })
  }

  async update(medicationData, token) {
    const { _id, ...updateFields } = medicationData;
    return this.request(`/medications/${_id}`, {
      method: "PUT",
      headers: this.setAuthHeader(token),
      body: updateFields,
    })
  }

  async delete(id, token) {
    return this.request(`/medications/${id}`, {
      method: "DELETE",
      headers: this.setAuthHeader(token),
    })
  }
}

class LogService extends ApiService {
  async getAll(token) {
    return this.request("/logs", {
      headers: this.setAuthHeader(token),
    })
  }

  async sync(logs, token) {
    return this.request("/logs/sync", {
      method: "POST",
      headers: this.setAuthHeader(token),
      body: { logs },
    })
  }

  async clearAll(token) {
    return this.request("/logs", {
      method: "DELETE",
      headers: this.setAuthHeader(token),
    })
  }
}

class ExportService extends ApiService {
  async exportData(token) {
    return this.request("/export", {
      headers: this.setAuthHeader(token),
    })
  }
}

export const authService = new AuthService()
export const medicationService = new MedicationService()
export const logService = new LogService()
export const exportService = new ExportService()
