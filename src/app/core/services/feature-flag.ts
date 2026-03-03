import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getRemoteConfig, fetchAndActivate, getBoolean } from 'firebase/remote-config';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FeatureFlagService {
  private remoteConfig: any;

  constructor() {
    const env = environment as any;
    
    if (env.firebase) {
      const app = initializeApp(env.firebase);
      this.remoteConfig = getRemoteConfig(app);
      
      this.remoteConfig.defaultConfig = {
        'enable_category_filter': true
      };
    } else {
      console.error("Firebase config not found in environment files.");
    }
  }

  async isCategoryFilterEnabled(): Promise<boolean> {
    if (!this.remoteConfig) return true;
    
    try {
      await fetchAndActivate(this.remoteConfig);
      return getBoolean(this.remoteConfig, 'enable_category_filter');
    } catch (error) {
      console.error("Error al obtener Remote Config", error);
      return true;
    }
  }
}