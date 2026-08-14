// VALIDATORS.JS - Validacija podataka
// Provjerava ispravnost unesenih podataka

class Validator {
  
  // Validiraj cijeli objekt kamere
  static validateCamera(camera) {
    const errors = [];

    if (!camera.objectName || camera.objectName.trim() === '') {
      errors.push('Naziv objekta je obavezan');
    }

    if (!camera.street || camera.street.trim() === '') {
      errors.push('Ulica je obavezna');
    }

    if (!camera.quality || camera.quality.trim() === '') {
      errors.push('Kvaliteta je obavezna');
    }

    if (!camera.retentionDays || camera.retentionDays < 1) {
      errors.push('Vreme čuvanja mora biti najmanje 1 dan');
    }

    if (!camera.status || camera.status.trim() === '') {
      errors.push('Status je obavezan');
    }

    if (camera.phone && !this.validatePhone(camera.phone)) {
      errors.push('Telefonski broj nije validan');
    }

    if (camera.email && !this.validateEmail(camera.email)) {
      errors.push('Email nije validan');
    }

    if (camera.cameraCount && camera.cameraCount < 1) {
      errors.push('Broj kamera mora biti najmanje 1');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Validiraj email
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validiraj telefonski broj
  static validatePhone(phone) {
    // Hrvatski telefonski broj: počinje s 0 ili +385, 9-10 znamenki
    const phoneRegex = /^(\+?385|0)?\d{8,10}$/;
    return phoneRegex.test(phone.replace(/\s|-|\(|\)/g, ''));
  }

  // Validiraj URL
  static validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Validiraj datum
  static validateDate(date) {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d);
  }

  // Validiraj broj
  static validateNumber(num, min = 0, max = Infinity) {
    return !isNaN(num) && num >= min && num <= max;
  }

  // Validiraj dužinu stringa
  static validateLength(str, min = 1, max = 255) {
    return str && str.length >= min && str.length <= max;
  }

  // Sanitiziraj string
  static sanitizeString(str) {
    return str
      .trim()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Validiraj JSON
  static validateJSON(jsonString) {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Validiraj CSV
  static validateCSV(csvString) {
    try {
      // Osnovna validacija - trebao bi valid header
      const lines = csvString.split('\n');
      return lines.length > 1;
    } catch (e) {
      return false;
    }
  }
}

// Primjer korištenja:
/*
const camera = {
  objectName: 'Test objekta',
  street: 'Ulica 123',
  quality: 'Full HD (1080p)',
  retentionDays: 30,
  status: 'aktivna',
  phone: '091 123 4567',
  email: 'test@example.com'
};

const validation = Validator.validateCamera(camera);
if (!validation.isValid) {
  console.log('Greške:', validation.errors);
} else {
  console.log('Kamera je validna!');
}
*/
