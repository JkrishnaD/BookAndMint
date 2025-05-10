# Slot Mint - Solana Experience Booking Platform

Slot Mint is a decentralized platform built on Solana that enables users to create, book, and manage experiences through blockchain-based slot reservations. The platform uses NFTs to represent bookings, providing a secure and transparent way to manage experience slots.

## 🌟 Features

### Core Features
- **Experience Creation**: Create and manage unique experiences with customizable details
  - Set title, description, and location
  - Define pricing in SOL
  - Add multiple time slots
  - Set cancellation policies

- **Slot Management**
  - Create flexible time slots for experiences
  - Set individual pricing for each slot
  - Track slot availability in real-time
  - Manage bookings through smart contracts

- **Booking System**
  - Secure booking through Solana blockchain
  - Instant confirmation with NFT minting
  - Transparent payment processing
  - Cancellation handling with fee management

- **User Profiles**
  - View created experiences
  - Track booked experiences
  - Manage active reservations
  - View booking history

### Technical Features
- Built on Solana blockchain
- Smart contract-based slot management
- NFT-based booking verification
- Real-time availability tracking
- Secure payment processing
- Responsive web interface

## 🏗️ Smart Contract Architecture

### Key Components

1. **Experience Account**
   ```rust
   pub struct Experience {
       pub organiser: Pubkey,
       pub title: String,
       pub description: String,
       pub location: String,
       pub price_lamports: u64,
       pub cancelation_fee_percent: u8,
   }
   ```

2. **Time Slot Account**
   ```rust
   pub struct TimeSlotAccount {
       pub experience: Pubkey,
       pub start_time: i64,
       pub end_time: i64,
       pub is_booked: bool,
       pub price: u64,
       pub booker: Option<Pubkey>,
   }
   ```

### Main Instructions
- `create_experience`: Initialize a new experience
- `add_time_slot`: Add available time slots to an experience
- `book_slot`: Book a time slot and mint NFT
- `cancel_booking`: Cancel a booking with fee handling

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Rust and Cargo
- Solana CLI tools
- Anchor Framework

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/JkrishnaD/BookAndMint.git
   cd slot-mint
   ```

2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install contract dependencies
   cd ../contract
   cargo build
   ```

3. Configure Solana:
   ```bash
   solana config set --url devnet
   ```

4. Start the development environment:
   ```bash
   # Start the contract
   anchor build
   anchor deploy

   # Start the frontend
   cd frontend
   npm run dev
   ```

## 💻 Frontend Architecture

### Key Components
- React-based SPA
- Tailwind CSS for styling
- Framer Motion for animations
- Solana wallet integration
- Responsive design

### Pages
- Landing Page
- Experience Creation
- Experience Listing
- Experience Details
- User Profile
- Booking Management

## 🔮 Future Developments

### Planned Features
1. **Enhanced Booking System**
   - Recurring slots
   - Group bookings
   - Waitlist functionality
   - Automated reminders

2. **Advanced Experience Management**
   - Experience categories
   - Rating system
   - Review system
   - Experience templates

3. **Payment Enhancements**
   - Multiple token support
   - Subscription-based experiences
   - Split payments
   - Refund automation

4. **Social Features**
   - Experience sharing
   - Social proof
   - Community features
   - Referral system

5. **Analytics & Reporting**
   - Booking analytics
   - Revenue tracking
   - User insights
   - Performance metrics

### Technical Improvements
- Cross-chain compatibility
- Enhanced security features
- Performance optimizations
- Mobile app development
- API development for third-party integration

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines and submit pull requests to our repository.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Solana Foundation
- Anchor Framework
- React Community
- All contributors and supporters

## 📞 Contact

For any queries or support, please reach out to us at:
- Email: support@slotmint.xyz
- Twitter: [@SlotMint](https://twitter.com/slotmint)
- Discord: [Join our community](https://discord.gg/slotmint) 
