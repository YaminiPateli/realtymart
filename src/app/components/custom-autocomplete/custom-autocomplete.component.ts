import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-autocomplete',
  templateUrl: './custom-autocomplete.component.html',
  styleUrls: ['./custom-autocomplete.component.css']
})
export class CustomAutocompleteComponent {
  query: string = '';
  showDropdown: boolean = false;
  suggestions: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

  onInput(event: Event) {
    const inputText = (event.target as HTMLInputElement).value;
    this.suggestions = this.filterSuggestions(inputText);
    this.showDropdown = this.suggestions.length > 0;
  }

  filterSuggestions(query: string): string[] {
    return this.suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(query.toLowerCase())
    );
  }

  selectSuggestion(suggestion: string) {
    this.query = suggestion;
    this.showDropdown = false;
  }
}
