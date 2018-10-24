import React from 'react';
import styled from 'styled-components';

import Comment from './Comment';

const Ruler = styled.hr`
	width: 100%;
	margin: 10px 5px !important;
`;

const CommentsWrapper = styled.div`
	padding: 5px;
`;

const CommentsSlideOut = ({ comments = [], createComment, deleteComment }) => {
	return (		
		<CommentsWrapper>
			<Ruler className="my-4" />
			
			<Comment 
				isEditable={true} 
				createComment={createComment}
			/>
			{comments.map( item => (
				<Comment 
					key={item.id}
					id={item.id}
					value={item.text}
					isEditable={false} 
					deleteComment={deleteComment}
				/>	
			))}
		</CommentsWrapper>
	);
};

export default CommentsSlideOut;