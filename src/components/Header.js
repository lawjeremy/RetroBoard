import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';

const Wrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 100px;	
	color: white;
	padding: 20px;
`;

const SettingsWrapper = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
`;

const IconWrapper = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
`;

const SettingButton = styled.button`
    padding: 5px 10px;
	border: none;
	margin: 0 0.5em 0 1em;
	font-size: 1.2em;
`;

const BottomNav = styled.nav`
	display: flex;
	justify-content: space-between;
	width: 100%;
	background: rgba(0,0,0,0.2);
	color: #fff;
`;

const Root = styled.div`
	top: ${({ showHeader }) => showHeader ? '0px': '-200px'};
	left: 0px;
	right: 0px;
	position: fixed;
	background-color: #420039;
	z-index: 1;
	transition: top 0.2s ease-in-out;
`;

const Ul = styled.ul`
	list-style-type: none;
	margin: 0px;
`;

const Button = styled.button`
	border: none;
	background-color: transparent;
	color: inherit;
	&: hover {
		background: rgba(255,255,255,0.4);
	}
`;


const Li = styled.li`
	display: inline;	
	line-height: 50px;
	& > a {
		display: inline-block;
		padding: 0px 10px;
		color: #fff;
		text-decoration: none;
		&: hover {
			background: rgba(255,255,255,0.4);
		}
	}
`;

const SearchInput = styled.input`
	margin-left: 1em;
`;

const delta = 5;

export default class Header extends React.PureComponent {
	
	constructor(props){
		super(props);
		this.state ={
			query: '',
			showHeader: true,
			didScroll: false,
			lastScrollTop: 0,
		};
		this.headerRef = React.createRef();
	}
	static propTypes = {
		userName: PropTypes.string,
		sendQuery: PropTypes.func,
	}

	componentDidMount(){
		window.addEventListener('scroll', this.handleScroll);
	}
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

	/* From https://codepen.io/egoens/pen/NxejgJ start*/
    hideHeader = () => {
        this.setState({
            showHeader: false,
        })
    }

    showHeader = () => {
        this.setState({
            showHeader: true,
        })
    }

    getDocHeight = () => {
        return Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );
    }

    hasScrolled = throttle(() => {
        const st = window.scrollY;
		const navbarHeight = this.headerRef.current.offsetHeight;
        // Make sure they scroll more than delta
        if(Math.abs(this.state.lastScrollTop - st) <= delta)
            return;

        if (st > navbarHeight){
			// Scroll Down
            this.hideHeader();
        } else {
            if(st < this.getDocHeight()) {
              this.showHeader();
            }
        }

        this.setState({
            lastScrollTop: st
        })
    }, 250)

    handleScroll = (event) => {
        this.setState({
            didScroll: true
        })

       	this.hasScrolled();

	}
	/* From https://codepen.io/egoens/pen/NxejgJ end*/
	
	handleInputChange = (event) => {
		const value =  event.target.value;
		this.props.sendQuery(value);
		this.setState({
			query: value.substr(0,30)
		})
	}

	render() {
		const { userName, search } = this.props;
		const { showHeader } = this.state; 
		return (
			<Root showHeader={showHeader}
				ref={this.headerRef}
			>			
				<Wrapper>
					<IconWrapper>
						<div>Welcome</div>
						<form>
							<SearchInput
								type='text'
								placeholder="Not Ready to Use..."
								ref={input => this.search = input}
								onChange={this.handleInputChange}
								value={this.state.query}
							/>
						</form>
					</IconWrapper>
					<SettingsWrapper>
						<div>{userName}</div>
						{/* <SettingButton className='btn btn-outline-light material-icons'>settings</SettingButton> */}
					</SettingsWrapper>				
				</Wrapper>
				<BottomNav>
					{/*This is the secondary nav*/}
					<Ul>
						<Li><a href=''>Some</a></Li>
						<Li><a href=''>Stuff</a></Li>
						<Li><a href=''>Here?</a></Li>
					</Ul>
					<Ul>
						<Li><a href=''>Copy Action Items</a></Li>
						<Li><Button onClick={this.props.handleExport}>Export Action Items</Button></Li>
					</Ul>
				</BottomNav>
			</Root>
		)
	}
};


