// WebAuthn/Passkey Hilfsfunktionen
// Temporäre Implementierung bis Supabase die signInWithPasskey Methode offiziell veröffentlicht

import { createClient } from '../supabase/client';

/**
 * Prüft, ob WebAuthn (für Passkeys benötigt) im Browser verfügbar ist
 */
export function isWebAuthnSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.PublicKeyCredential !== 'undefined'
  );
}

/**
 * Registriert einen neuen Passkey
 */
export async function registerPasskey(username: string) {
  if (!isWebAuthnSupported()) {
    throw new Error('WebAuthn wird von deinem Browser nicht unterstützt.');
  }

  try {
    const supabase = createClient();
    
    // Hier würde normalerweise die Logik für die Passkey-Registrierung stehen
    // In der aktuellen Supabase-Version ist dies noch nicht verfügbar
    
    // Beispiel für eine WebAuthn-Registrierung:
    // 1. Challenge vom Server anfordern
    // 2. Registrierung über navigator.credentials.create() durchführen
    // 3. Ergebnis an den Server senden

    // Vorübergehende Fehlermeldung
    throw new Error('Passkey-Registrierung ist noch in der Entwicklung. Bitte verwende vorerst andere Authentifizierungsmethoden.');
  } catch (error) {
    console.error('Fehler bei der Passkey-Registrierung:', error);
    throw error;
  }
}

/**
 * Authentifizierung mit Passkey
 */
export async function authenticateWithPasskey() {
  if (!isWebAuthnSupported()) {
    throw new Error('WebAuthn wird von deinem Browser nicht unterstützt.');
  }

  try {
    const supabase = createClient();

    // Hier würde normalerweise die Logik für die Passkey-Authentifizierung stehen
    // In der aktuellen Supabase-Version ist dies noch nicht verfügbar
    
    // Beispiel für eine WebAuthn-Authentifizierung:
    // 1. Challenge vom Server anfordern
    // 2. Authentifizierung über navigator.credentials.get() durchführen
    // 3. Ergebnis an den Server senden

    // Vorübergehende Fehlermeldung
    throw new Error('Passkey-Authentifizierung ist noch in der Entwicklung. Bitte verwende vorerst andere Authentifizierungsmethoden.');
  } catch (error) {
    console.error('Fehler bei der Passkey-Authentifizierung:', error);
    throw error;
  }
}
