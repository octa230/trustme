export const states = ['Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah']

export const ledgerAccountTypes = ['asset', 'liability', 'equity', 'revenue', 'expense']

export const handleDateChange=(newDate, setterFunc)=>{
  
}


export const createCalc = (state) => {
  const {
    vatEnabled,
    vatRate,
    discount,
    cash,
    bank,
    card,
    cashAmount,
    bankAmount,
    cardAmount,
    advanceAmount,
    items
  } = state;

  return {
    // Calculate the gross total of all items (VAT included in prices)
    itemsGrossTotal: () => {
      return items.reduce((total, item) => {
        // Use the item's total (unitCost + vat) instead of salePrice * qty
        return total + (item.total || 0); 
      }, 0);
    },

    // Calculate discount amount (applied to gross total)
    discountAmount: function () {
      const grossTotal = this.itemsGrossTotal();
      if (typeof discount === 'number' && discount < 1) {
        // Percentage discount
        return grossTotal * discount;
      } else {
        // Fixed amount discount
        return Math.min(grossTotal, discount || 0);
      }
    },

    // Calculate total after discount (gross amount - discount)
    totalAfterDiscount: function () {
      return this.itemsGrossTotal() - this.discountAmount();
    },

    // Extract the VAT component from the discounted total
    vatAmount: function () {
      if (!vatEnabled) return 0;

      const discountedTotal = this.totalAfterDiscount();
      // VAT component = total - (total / (1 + vatRate))
      return discountedTotal - (discountedTotal / (1 + vatRate));
    },

    // Calculate total without VAT
    totalWithoutVat: function () {
      if (vatEnabled) {
        // If VAT is enabled, extract VAT from the discounted total
        return this.totalAfterDiscount() - this.vatAmount();
      } else {
        // If VAT is disabled, the discounted total is already without VAT
        return this.totalAfterDiscount();
      }
    },

    // Return advance payment amount
    advanceAmount: () => {
      return advanceAmount;
    },

    // Return cash payment amount
    cashAmount: () => {
      return cash ? cashAmount : 0;
    },

    // Return bank transfer payment amount
    bankAmount: () => {
      return bank ? bankAmount : 0;
    },

    // Return card payment amount
    cardAmount: () => {
      return card ? cardAmount : 0;
    },

    // Calculate total paid amount (cash + bank + card + advance)
    paidAmount: function () {
      return this.cashAmount() + this.bankAmount() + this.cardAmount() + this.advanceAmount();
    },

    // Calculate grand total (equals totalAfterDiscount since we apply discount to gross)
    grandTotal: function () {
      return this.totalAfterDiscount();
    },

    // Calculate pending (remaining) amount
    pendingAmount: function () {
      return Math.max(0, this.grandTotal() - this.paidAmount());
    }
  };
};



export const round2 = (num)=> Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23